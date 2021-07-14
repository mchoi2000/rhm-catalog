import React from 'react';
import { GetDatasets } from '../../util/fetchCatalog.js';
import dynamicSort from '../../util/dynamicSort';
import { CSVLink } from 'react-csv';

class DatasetList extends React.Component {
  constructor(props) {
    super(props); //since we are extending class Table so we have to use super in order to override Component class constructor
    this.state = {
      //state is by default an object
      products: this.datalist,
      sortby: 'dataset',
    };
  }

  onClick = key => this.setState({ sortby: key });

  render() {
    const updated = this.props.updated;
    const datasets = GetDatasets()[0];
    const datalist = datasets.map(prod => {
      let category1 = prod.primaryCategory
        ? prod.primaryCategory.content.name
        : 'N/A';
      let category2all = prod.categories;
      let category2arr = [];
      for (let cat of category2all) {
        const c = cat.content.name;
        if (c !== category1) category2arr.push(c);
      }

      let editions = prod.editions.filter(
        e => e.publishedEditionContent !== null
      );
      let editionType = [];
      if (editions) {
        editions.forEach(edi => {
          const type = edi.publishedEditionContent.planType;
          const chargeTypes = edi.publishedEditionContent.chargeTypes;

          if (type === 'SELF_SERVICE' || type === 'PURCHASE') {
            if (
              chargeTypes &&
              chargeTypes.indexOf('Usage') > -1 &&
              editionType.indexOf('Paygo') < 0
            )
              editionType.push('Paygo');
            else if (editionType.indexOf('Buy') === -1) editionType.push('Buy');
          }
          if (
            (type === 'FREE_TRIAL' || type === 'TRIAL') &&
            editionType.indexOf('Try') < 0
          )
            editionType.push('Try');
          if (
            (type === 'FREE_EDITION' || type === 'FREE') &&
            editionType.indexOf('Free') < 0
          )
            editionType.push('Free');
        });
      }
      let edition = editionType.sort().join(', ');

      let formats =
        prod.publishedContent.formats &&
        prod.publishedContent.formats.join(', ');

      const convertTopic = {
        ANALYTICS: 'Analytics',
        BIG_DATA: 'Big data',
        CITY: 'City',
        CLIMATE: 'Climate',
        COVID19: 'Covid-19',
        ECONOMICS: 'Economics',
        ENVIRONMENT: 'Environment',
        EVENTS: 'Events',
        HISTORICAL: 'Historical',
        MOBILITY: 'Mobility',
        MACHINE_LEARNING: 'Machine learning',
        POPULATION: 'Population',
        RESEARCH: 'Research',
        SCIENCE: 'Science',
        SOCIAL: 'Social',
        WEATHER: 'Weather',
      };

      const topicsArr = prod.publishedContent.topics;
      const topics = topicsArr.map(topic =>
        convertTopic[topic] ? convertTopic[topic] : topic
      );
      const topic = topics.join(', ');

      const convertIndustry = {
        AGRICULTURE: 'Agriculture',
        EDUCATION: 'Education',
        ENERGY: 'Energy',
        FINANCIAL_SERVICES: 'Financial services',
        GOVERNMENT: 'Government',
        HEALTHCARE: 'Healthcare',
        INSURANCE: 'Insurance',
        MANUFACTURING: 'Manufacturing',
        OCEANOGRAPHY: 'Oceanography',
        PUBLIC_ADMIN: 'Public admin',
        PUBLIC_SAFETY: 'Public safety',
        REAL_ESTATE: 'Real estate',
        RETAIL: 'Retail',
        TRANSPORTATION: 'Transportation',
        TRAVEL_HOSPITALITY: 'Travel/Hospitality',
      };

      const industriesArr = prod.publishedContent.industries;
      const industries = industriesArr.map(ind =>
        convertIndustry[ind] ? convertIndustry[ind] : ind
      );
      const industry = industries.join(', ');

      let source =
        prod.publishedContent.assetUpdatedInfo.source &&
        prod.publishedContent.assetUpdatedInfo.source.name;

      const convertFrequency = {
        DAILY: 'Daily',
        WEEKLY: 'Weekly',
        MONTHLY: 'Monthly',
        QUARTERLY: 'Quarterly',
        BIANNUALLY: 'Bi-annually',
        ANNUALLY: 'Annually',
        HISTORICAL: 'Histrical',
        NA: 'Not available',
      };

      let frequency =
        prod.publishedContent.assetUpdatedInfo.frequency &&
        convertFrequency[prod.publishedContent.assetUpdatedInfo.frequency];

      return {
        dataset: prod.publishedContent.title,
        page: prod.productPageName[0],
        source,
        // updated,
        formats,
        topic,
        edition,
        industry,
        frequency,
      };
    });

    const renderTableHeader = () => {
      let header = [
        '',
        'dataset',
        'source',
        'industry',
        'topic',
        'format',
        'edition',
        'update frequency',
      ];

      return header.map((key, index) => {
        let sort = key;

        if (key === '') sort = 'dataset';
        else if (key === 'updated') sort = '-updated';
        else if (key === 'format') sort = 'formats';
        else if (key === 'source') sort = 'source';
        else if (key === 'update frequency') sort = '-frequency';

        return (
          <th key={index}>
            <span onClick={this.onClick.bind(this, sort)}>
              {key.toUpperCase()}
            </span>
          </th>
        );
      });
    };

    const renderProdData = () => {
      return datalist.map((prod, index) => {
        const {
          dataset,
          page,
          source,
          formats,
          topic,
          edition,
          industry,
          // updated,
          frequency,
        } = prod; //destructuring
        const url = `https://marketplace.redhat.com/en-us/products/${page}`;

        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>
              <a href={url} rel="noreferrer" target="_blank">
                <strong>{dataset}</strong>
              </a>
            </td>
            <td>{source}</td>
            <td>{industry}</td>
            <td>{topic}</td>
            <td>{formats}</td>
            <td>{edition}</td>
            <td>{frequency}</td>
            {/* <td className="fontCenter">{packType}</td> */}
          </tr>
        );
      });
    };

    datalist.sort(dynamicSort(this.state.sortby));

    return (
      <div className="dataset-table">
        <div className="csvlink">
          Download data in{' '}
          <CSVLink
            filename={`rhm-datasets-as-of-${updated}.csv`}
            data={datalist}>
            csv
          </CSVLink>
        </div>
        <table className="products">
          <tbody>
            <tr>{renderTableHeader()}</tr>
            {renderProdData()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default DatasetList;
