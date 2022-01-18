def GUID       = "GUID"
def devProj    = "pipeline-$GUID-dev"
def testProj   = "pipeline-$GUID-test"
def prodProj   = "pipeline-$GUID-prod"
def svc_name   = "rhm-catalog"

pipeline {
  agent any
  stages{
    stage("Build"){
      steps{
        echo '*** Build Starting ***'
        script{
          openshift.withCluster() {
            openshift.withProject("${devProj}") {
              openshift.selector('bc', 'rhm-catalog').startBuild("--wait").logs('-f')
            }
          }
        echo '*** Build Complete ***'
        }
      }
    }
    stage ("Deploy and Verify in Development Env") {
      steps{
        echo '*** Deployment Starting ***'
        script{
          openshift.withCluster() {
            openshift.withProject("${devProj}") {
              // Deploy the cotd application in the devProject
              openshift.selector('dc', 'rhm-catalog').rollout().latest();
              // Wait for application to be deployed
              def dc = openshift.selector("dc", "rhm-catalog").object()
              while (dc.spec.replicas != dc.status.availableReplicas) {
                sleep 1
              }
            }
          }
        }
        echo '*** Deployment Complete ***'
        echo '*** Service Verification Starting ***'
        script{
          openshift.withCluster() {
            openshift.withProject("${devProj}") {
              // def svc = openshift.selector("svc", "rhm-catalog")
              // openshiftVerifyService apiURL: 'https://openshift.default.svc.cluster.local', authToken: '', namespace: 'pipeline-${GUID}-dev', svcName: 'rhm-catalog', verbose: 'false'
              def connected = openshift.verifyService("${svc_name}")
              if (connected) {
                echo "Able to connect to ${svc_name}"
              } else {
                echo "Unable to connect to ${svc_name}"
              }

              // openshiftTag(srcStream: 'rhm-catalog', srcTag: 'latest', destStream: 'rhm-catalog', destTag: 'testready')
              openshift.tag("${devProj}/rhm-catalog:latest", "${devProj}/rhm-catalog:testready")
            }
          }
        }
        echo '*** Service Verification Complete ***'
      }
    }
    stage ('Deploy and Test in Testing Env') {
      steps{
        echo "*** Deploy testready build in pipeline-${GUID}-test project  ***"
        script {
          openshift.withCluster() {
            openshift.withProject("${testProj}") {
              // openshiftDeploy apiURL: 'https://openshift.default.svc.cluster.local', authToken: '', depCfg: 'rhm-catalog', namespace: 'pipeline-${GUID}-test', verbose: 'false', waitTime: ''
              // openshiftVerifyDeployment apiURL: 'https://openshift.default.svc.cluster.local', authToken: '', depCfg: 'rhm-catalog', namespace: 'pipeline-${GUID}-test', replicaCount: '1', verbose: 'false', verifyReplicaCount: 'false', waitTime: '10'
              // Deploy the cotd application in the testProject
              openshift.selector('dc', 'rhm-catalog').rollout().latest();
              // Wait for application to be deployed
              def dc = openshift.selector("dc", "rhm-catalog").object()
              while (dc.spec.replicas != dc.status.availableReplicas) {
                sleep 1
              }
              // curl the testProject route to get cats
              // sh 'curl http://rhm-catalog-pipeline-${GUID}-test.apps.shared-na4.na4.openshift.opentlc.com/ | grep cats -q'
              def route = openshift.selector("route", "rhm-catalog").object()
              def the_route = "${route.spec.host}"
              echo "route: ${the_route}"
              sh "curl -s http://${the_route}/item.php | grep -q cats"
            }
          }
        }
      }
    }
    stage ('Promote and Verify in Production Env') {
      steps{
        echo '*** Waiting for Input ***'
        script{
          openshift.withCluster() {
            openshift.withProject("${prodProj}") {
              input message: 'Should we deploy to Production?', ok: "Promote"
              // openshiftTag(srcStream: 'rhm-catalog', srcTag: 'testready', destStream: 'rhm-catalog', destTag: 'prodready')
              openshift.tag("${devProj}/rhm-catalog:testready", "${devProj}/rhm-catalog:prodready")
              // openshiftDeploy apiURL: 'https://openshift.default.svc.cluster.local', authToken: '', depCfg: 'rhm-catalog', namespace: 'pipeline-${GUID}-prod', verbose: 'false', waitTime: ''
              echo '*** Deploying to Production ***'
              def dc = openshift.selector("dc", "rhm-catalog").object()
              while (dc.spec.replicas != dc.status.availableReplicas) {
                sleep 1
              }
              // openshiftVerifyDeployment apiURL: 'https://openshift.default.svc.cluster.local', authToken: '', depCfg: 'rhm-catalog', namespace: 'pipeline-${GUID}-prod', replicaCount: '1', verbose: 'false', verifyReplicaCount: 'false', waitTime: '10'
              sleep 10
              // test route
              def route = openshift.selector("route", "rhm-catalog").object()
              def the_route = "${route.spec.host}"
              echo "route: ${the_route}"
              sh "curl -s http://${the_route}/item.php | grep -q cats"
            }
          }
        }
      }
    }
  }
}