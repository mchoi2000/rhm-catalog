import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  Tab,
} from 'carbon-components-react';
import CommercePie from '../../components/charts/CommercePie';
import CommercePieDetail from '../../components/charts/CommercePieDetail';
import Certification from '../../components/charts/Certification';
import Category from '../../components/charts/Category';
import ProductTable from '../../components/tables/ProductTable';
import { GetProducts } from '../../util/fetchCatalog';
import {
  total,
  Editions,
  EditionsDetail,
  Categories,
  Levels
} from '../../util/reducer';

const props = {
  tabs: {
    selected: 0,
    role: 'navigation',
  },
  tab: {
    role: 'presentation',
    tabIndex: 0,
  },
};

const Software = ({updated}) => {
  return (
    <div className="bx--grid bx--grid--full-width landing-page">
      <div className="bx--row landing-page__banner">
        <div className="bx--col-lg-16">
          <Breadcrumb noTrailingSlash aria-label="Page navigation">
            <BreadcrumbItem>
              <a href="https://marketplace.redhat.com">Red Hat Marketplace</a>
            </BreadcrumbItem>
          </Breadcrumb>
          <h1 className="landing-page__heading">
            {GetProducts()[1]} Software Products
          </h1>
          <ul className="summary">
            <li>Datasets: {total() - GetProducts()[1]}</li>
            <li>Total products: {total()}</li>
            <li>Last updated: {updated}</li>
          </ul>
        </div>
      </div>
      <div className="landing-page__r2">  
          <Tabs {...props.tabs} aria-label="Tab navigation">
            <Tab {...props.tab} label="Overview" >
              <div className="rhm-commerce-charts bx--row">
                <CommercePie className="center" {...total} editions={Editions} />
                <CommercePieDetail className="center" {...total} editions={EditionsDetail} /> 
              </div>
              <Category {...total} cat2={Categories} />
              <Certification {...total} levels={Levels} />
            </Tab>
            <Tab {...props.tab} label="List">
              <ProductTable updated={updated} />
            </Tab>
          </Tabs>
      </div>
    </div>
  );
};

export default Software;
