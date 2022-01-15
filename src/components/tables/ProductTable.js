import React, { createRef } from 'react';
import { GetProducts } from '../../util/fetchCatalog';
import { GetPricing } from '../../util/fetchPricing';
import { numberWithCommas } from '../../util/format';
import { CSVLink } from 'react-csv';
import dynamicSort from '../../util/dynamicSort';
import startingAtPricesSaved from './startingAtPrices';

class ProductList extends React.Component {
  constructor(props) {
    super(props); // extending class Table: use super() to override Component class constructor
    this.state = {
      products: this.prodlist,
      sortby: 'product',
    };
  }

  onClick = key => this.setState({ sortby: key });

  render() {
    const updated = this.props.updated;
    const products = GetProducts()[0];
    const pricing = GetPricing();

    const prodlist = products.map(prod => {
      const productName = prod.publishedContent.title.trim();
      const productId = prod.id;
      let comp = prod.company.name.trim();
      comp.indexOf('IBM') > -1 ?? (comp = 'IBM');
      comp.indexOf('Red Hat') > -1 ?? (comp = 'Red Hat');
      let category1 = prod.primaryCategory
        ? prod.primaryCategory.content.name
        : 'N/A';
      let category2all = prod.categories;
      let category2arr = [];
      for (let cat of category2all) {
        const c = cat.content.name;
        if (c !== category1) category2arr.push(c);
      }

      let category2 = category2arr.join(', ');

      // remove empty editions
      let editions = prod.editions.filter(
        e => e.publishedEditionContent !== null
      );

      let editionType = [];
      let starting = ''; // formatted pricing $10,000
      let startingAtPrice = null; // product-level price
      let startingAtPriceCAD = null; // product-level price
      let paygoPrice = null;
      let chargeUnit = '';
      let priceFrequency = ''; // annual, monthly
      let supportedCountries = []; // US, CA

      // editions per product
      if (editions) {
        editions.forEach(edi => {
          const editionId = edi.id;
          const type = edi.publishedEditionContent.planType;
          const chargeTypes = edi.publishedEditionContent.chargeTypes;
          const countries = edi.publishedEditionContent.supportedCountries;
          if (countries.length > supportedCountries.length)
            supportedCountries = countries;

          if (type === 'SELF_SERVICE' || type === 'PURCHASE') {
            if (
              chargeTypes &&
              chargeTypes.indexOf('Usage') > -1 &&
              editionType.indexOf('Paygo') < 0
            )
              editionType.push('Paygo');
            else if (editionType.indexOf('Purchase') === -1)
              editionType.push('Purchase');

            // starting-at price
            if (editionId) {
              const editionPricingEntry = pricing.filter(
                p => p.id === editionId
              ); // pricing details

              const editionPricing = editionPricingEntry[0]; // 1:1 (prodEdition:pricingEdition)
              const billingFrequency = editionPricing.allowedBillingFrequencies; // Annual or Monthly
              const charges = editionPricing.editionCharges;

              charges.forEach(c => {
                const type = c.type; // Usage, Recurring
                const priceFreq = c.priceFrequency; // Monthly, Annual
                const uomSuffix = c.uom.singularName;
                const required = c.required;
                const isAnnualBilling4MonthlyPrice =
                  priceFreq === 'Monthly' &&
                  billingFrequency.length === 1 &&
                  billingFrequency.indexOf('Annual') > -1;
                let price;
                let priceCAD;

                if (required) {
                  price = c.tiers[0].pricing[0].price;

                  if (isAnnualBilling4MonthlyPrice) {
                    price = price * 12;
                  }
                }

                if (type === 'Usage') {
                  startingAtPrice = price;
                  paygoPrice = price;
                  priceFrequency = 'Paygo';
                  chargeUnit = uomSuffix;
                } else if (
                  type === 'Recurring' &&
                  paygoPrice === null &&
                  (startingAtPrice === null ||
                    (price && price < startingAtPrice))
                ) {
                  startingAtPrice = price;
                  priceFrequency = isAnnualBilling4MonthlyPrice
                    ? 'Annual'
                    : priceFreq;
                  chargeUnit = uomSuffix;
                }
              });
            }
          }

          if (
            (type === 'FREE_TRIAL' || type === 'TRIAL') &&
            editionType.indexOf('Trial') < 0
          )
            editionType.push('Trial');
          if (
            (type === 'FREE_EDITION' || type === 'FREE') &&
            editionType.indexOf('Free') < 0
          )
            editionType.push('Free');
        });
      }

      if (startingAtPrice !== null) {
        const cached = startingAtPricesSaved[productName];
        // console.log(productName, cached);

        if (startingAtPrice !== cached) {
          console.error(
            `${productName} starting-at calculated price ${startingAtPrice} doesn't match with the cached value ${cached}.`
          );
          startingAtPrice = cached; // use cached value for display
        }

        starting =
          startingAtPrice !== undefined &&
          `$${numberWithCommas(startingAtPrice)}`;
      }

      let edition = editionType.sort().join(', ');
      let countries = supportedCountries
        .sort()
        .reverse()
        .join(';, ');

      let packType =
        editions[0].publishedEditionContent.packageType === 'OPERATOR'
          ? 'Operator'
          : 'SaaS';

      let lvl =
        editions[0] &&
        editions[0].publishedEditionContent &&
        editions[0].publishedEditionContent.certification &&
        editions[0].publishedEditionContent.certification.operatorCapabilities;
      const lvlText = [
        'n/a',
        'Basic install',
        'Seamless upgrades',
        'Full lifecycle',
        'Deep insights',
        'Auto pilot',
      ];
      lvl ? (lvl = `${lvl}: ${lvlText[lvl]}`) : (lvl = '');

      const ocp_version = editions[0].publishedEditionContent.openShiftVersion;
      let openshift =
        ocp_version && ocp_version !== 'undefined'
          ? ocp_version.split(' ')[0]
          : '';

      if (openshift && openshift.indexOf(',') > 0)
        openshift = openshift.replace(',', ' ');

      const created = prod.created.split('T')[0];
      const updated = prod.updated.split('T')[0];

      const processedData = {
        product: productName,
        productId,
        page: prod.productPageName[0],
        company: comp,
        category1,
        category2,
        countries,
        edition,
        starting,
        startingAtPrice,
        chargeUnit,
        priceFrequency,
        packType,
        level: lvl,
        openshift,
        created,
        updated,
      };

      return processedData;
    });

    const renderTableHeader = () => {
      let header = [
        '',
        'product',
        'company',
        'category',
        'countries',
        // 'secondary category',
        'edition',
        'starting at (USD)',
        'pricing unit',
        'term',
        'type',
        'capabilities',
        // 'openshift',
        // 'created',
        'updated',
      ];

      return header.map((key, index) => {
        let sort = key;

        if (key === '') sort = 'product';
        else if (key === 'capabilities') sort = '-level';
        else if (key === 'category') sort = 'category1';
        else if (key === 'countries') sort = '-countries';
        // else if (key == 'secondary category') sort = '-category2';
        else if (key === 'starting at (USD)') sort = 'startingAtPrice';
        else if (key === 'pricing unit') sort = '-chargeUnit';
        else if (key === 'term') sort = '-priceFrequency';
        else if (key === 'operator') sort = '-operator';
        else if (key === 'type') sort = '-packType';
        else if (key === 'openshift') sort = '-openshift';
        else if (key === 'created') sort = '-created';
        else if (key === 'updated') sort = '-updated';

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
      return prodlist.map((prod, index) => {
        const {
          product,
          page,
          company,
          category1,
          countries,
          // category2,
          edition,
          starting,
          chargeUnit,
          priceFrequency,
          packType,
          level,
          // openshift,
          // created,
          updated,
        } = prod; //destructuring
        const url = `https://marketplace.redhat.com/en-us/products/${page}`;

        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>
              <a href={url} rel="noreferrer" target="_blank">
                <strong>{product}</strong>
              </a>
            </td>
            <td>{company}</td>
            <td>{category1}</td>
            <td>
              {countries.split(';').map(country => {
                let cc = country[0] === ',' ? country.substr(2) : country;
                cc = cc.trim().toLowerCase();
                const url = `https://marketplace.redhat.com/en-${cc}/products/${page}/pricing`;
                return (
                  <a href={url} rel="noreferrer" target="_blank">
                    {country}
                  </a>
                );
              })}
            </td>
            {/* <td>{category2}</td> */}
            <td>{edition}</td>
            <td>{starting}</td>
            <td>{chargeUnit}</td>
            <td>{priceFrequency}</td>
            <td>{packType}</td>
            <td>{level}</td>
            {/* <td>{openshift}</td> */}
            {/* <td>{created}</td> */}
            <td>{updated}</td>
          </tr>
        );
      });
    };

    prodlist.sort(dynamicSort(this.state.sortby));

    return (
      <div className="rhm-table">
        <div className="csvlink">
          Download data in{' '}
          <CSVLink
            filename={`rhm-products-as-of-${updated}.csv`}
            data={prodlist}>
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

export default ProductList;
