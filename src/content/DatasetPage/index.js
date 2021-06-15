import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'carbon-components-react';
import { GetProducts } from '../../util/fetchCatalog';
import DatasetTable from '../../components/tables/DatasetTable';
import { total } from '../../util/reducer';

const DatasetPage = ({ updated }) => {
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
            {GetProducts()[2] - GetProducts()[1]} Dataset Products
          </h1>
          <ul className="summary">
            <li>Software: {GetProducts()[1]}</li>
            <li>Total products: {total()}</li>
            <li>Last updated: {updated}</li>
          </ul>
        </div>
      </div>
      <div className="rhm-table">
        <DatasetTable updated={updated} />
      </div>
    </div>
  );
};

export default DatasetPage;
