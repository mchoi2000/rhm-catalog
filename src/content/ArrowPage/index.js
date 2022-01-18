import React from 'react';
import { Breadcrumb, BreadcrumbItem, Tabs, Tab } from 'carbon-components-react';
import ArrowTable from '../../components/tables/ArrowTable';
import { GetProducts } from '../../util/fetchCatalog';

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

const Arrow = ({ updated }) => {
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
            Product Catalog for Arrowsphere
          </h1>
          <ul className="summary">
            <li>Last updated: {updated}</li>
          </ul>
        </div>
      </div>
      <div>
        <ArrowTable updated={updated} />
      </div>
    </div>
  );
};

export default Arrow;
