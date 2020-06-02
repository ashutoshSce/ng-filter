import { Component } from '@angular/core';

import { SingleFilterModel } from './filter-query/models/single-filter.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  filters: SingleFilterModel[] = [];
  filterQuery: any = [];
  timelineConfig = {
    dateFormat: '%b %Y',
    chartType: 'area'
  };
  timelineValue = [];
  timelineData = [
    { date: 'Jan 2000', data: 1394.46 },
    { date: 'Feb 2000', data: 1366.42 },
    { date: 'Mar 2000', data: 1498.58 },
    { date: 'Apr 2000', data: 1452.43 },
    { date: 'May 2000', data: 1420.6 },
    { date: 'Jun 2000', data: 1454.6 },
    { date: 'Jul 2000', data: 1430.83 },
    { date: 'Aug 2000', data: 1517.68 },
    { date: 'Sep 2000', data: 1436.51 },
    { date: 'Oct 2000', data: 1429.4 },
    { date: 'Nov 2000', data: 1314.95 },
    { date: 'Dec 2000', data: 1320.28 },
    { date: 'Jan 2001', data: 1366.01 },
    { date: 'Feb 2001', data: 1239.94 },
    { date: 'Mar 2001', data: 1160.33 },
    { date: 'Apr 2001', data: 1249.46 },
    { date: 'May 2001', data: 1255.82 },
    { date: 'Jun 2001', data: 1224.38 },
    { date: 'Jul 2001', data: 1211.23 },
    { date: 'Aug 2001', data: 1133.58 },
    { date: 'Sep 2001', data: 1040.94 },
    { date: 'Oct 2001', data: 1059.78 },
    { date: 'Nov 2001', data: 1139.45 },
    { date: 'Dec 2001', data: 1148.08 },
    { date: 'Jan 2002', data: 1130.2 },
    { date: 'Feb 2002', data: 1106.73 },
    { date: 'Mar 2002', data: 1147.39 },
    { date: 'Apr 2002', data: 1076.92 },
    { date: 'May 2002', data: 1067.14 },
    { date: 'Jun 2002', data: 1989.82 },
    { date: 'Jul 2002', data: 1911.62 },
    { date: 'Aug 2002', data: 1916.07 },
    { date: 'Sep 2002', data: 1815.28 },
    { date: 'Oct 2002', data: 1885.76 },
    { date: 'Nov 2002', data: 1936.31 },
    { date: 'Dec 2002', data: 1879.82 },
    { date: 'Jan 2003', data: 1855.7 },
    { date: 'Feb 2003', data: 1841.15 },
    { date: 'Mar 2003', data: 1848.18 },
    { date: 'Apr 2003', data: 1916.92 },
    { date: 'May 2003', data: 1963.59 },
    { date: 'Jun 2003', data: 1974.5 },
    { date: 'Jul 2003', data: 1990.31 },
    { date: 'Aug 2003', data: 1008.01 },
    { date: 'Sep 2003', data: 1995.97 },
    { date: 'Oct 2003', data: 1050.71 },
    { date: 'Nov 2003', data: 1058.2 },
    { date: 'Dec 2003', data: 1111.92 },
    { date: 'Jan 2004', data: 1131.13 },
    { date: 'Feb 2004', data: 1144.94 },
    { date: 'Mar 2004', data: 1126.21 },
    { date: 'Apr 2004', data: 1107.3 },
    { date: 'May 2004', data: 1120.68 },
    { date: 'Jun 2004', data: 1140.84 },
    { date: 'Jul 2004', data: 1101.72 },
    { date: 'Aug 2004', data: 1104.24 },
    { date: 'Sep 2004', data: 1114.58 },
    { date: 'Oct 2004', data: 1130.2 },
    { date: 'Nov 2004', data: 1173.82 },
    { date: 'Dec 2004', data: 1211.92 },
    { date: 'Jan 2005', data: 1181.27 },
    { date: 'Feb 2005', data: 1203.6 },
    { date: 'Mar 2005', data: 1180.59 },
    { date: 'Apr 2005', data: 1156.85 },
    { date: 'May 2005', data: 1191.5 },
    { date: 'Jun 2005', data: 1191.33 },
    { date: 'Jul 2005', data: 1234.18 },
    { date: 'Aug 2005', data: 1220.33 },
    { date: 'Sep 2005', data: 1228.81 },
    { date: 'Oct 2005', data: 1207.01 },
    { date: 'Nov 2005', data: 1249.48 },
    { date: 'Dec 2005', data: 1248.29 },
    { date: 'Jan 2006', data: 1280.08 },
    { date: 'Feb 2006', data: 1280.66 },
    { date: 'Mar 2006', data: 1294.87 },
    { date: 'Apr 2006', data: 1310.61 },
    { date: 'May 2006', data: 1270.09 },
    { date: 'Jun 2006', data: 1270.2 },
    { date: 'Jul 2006', data: 1276.66 },
    { date: 'Aug 2006', data: 1303.82 },
    { date: 'Sep 2006', data: 1335.85 },
    { date: 'Oct 2006', data: 1377.94 },
    { date: 'Nov 2006', data: 1400.63 },
    { date: 'Dec 2006', data: 1418.3 },
    { date: 'Jan 2007', data: 1438.24 },
    { date: 'Feb 2007', data: 1406.82 },
    { date: 'Mar 2007', data: 1420.86 },
    { date: 'Apr 2007', data: 1482.37 },
    { date: 'May 2007', data: 1530.62 },
    { date: 'Jun 2007', data: 1503.35 },
    { date: 'Jul 2007', data: 1455.27 },
    { date: 'Aug 2007', data: 1473.99 },
    { date: 'Sep 2007', data: 1526.75 },
    { date: 'Oct 2007', data: 1549.38 },
    { date: 'Nov 2007', data: 1481.14 },
    { date: 'Dec 2007', data: 1468.36 },
    { date: 'Jan 2008', data: 1378.55 },
    { date: 'Feb 2008', data: 1330.63 },
    { date: 'Mar 2008', data: 1322.7 },
    { date: 'Apr 2008', data: 1385.59 },
    { date: 'May 2008', data: 1400.38 },
    { date: 'Jun 2008', data: 1280 },
    { date: 'Jul 2008', data: 1267.38 },
    { date: 'Aug 2008', data: 1282.83 },
    { date: 'Sep 2008', data: 1166.36 },
    { date: 'Oct 2008', data: 1968.75 },
    { date: 'Nov 2008', data: 1896.24 },
    { date: 'Dec 2008', data: 1903.25 },
    { date: 'Jan 2009', data: 1825.88 },
    { date: 'Feb 2009', data: 1735.09 },
    { date: 'Mar 2009', data: 1797.87 },
    { date: 'Apr 2009', data: 1872.81 },
    { date: 'May 2009', data: 1919.14 },
    { date: 'Jun 2009', data: 1919.32 },
    { date: 'Jul 2009', data: 1987.48 },
    { date: 'Aug 2009', data: 1020.62 },
    { date: 'Sep 2009', data: 1057.08 },
    { date: 'Oct 2009', data: 1036.19 },
    { date: 'Nov 2009', data: 1095.63 },
    { date: 'Dec 2009', data: 1115.1 },
    { date: 'Jan 2010', data: 1073.87 },
    { date: 'Feb 2010', data: 1104.49 },
    { date: 'Mar 2010', data: 1140.45 }
  ];

  constructor() {
    this.filters.push(
      new SingleFilterModel('Bikes', 'Bikes', ['Honda', 'TVS', 'Yamaha']),
      new SingleFilterModel('Cars', 'Cars', ['Audi', 'Benz', 'Maruti', 'Suzuki']),
      new SingleFilterModel('Company', 'Company', ['Alphabet', 'Facebook', 'Google', 'Microsoft']),
      new SingleFilterModel('Cycles', 'Cycles', ['Decathlon', 'Hercules'], 'string', undefined, true)
    );
  }

  public filterQueryUpdated() {
    console.log(this.filterQuery);
  }

  public timelineValueChange() {
    console.log(this.timelineValue);
  }

  public setChartType(chartType) {
    this.timelineConfig.chartType = chartType;
    this.timelineConfig = Object.assign({}, this.timelineConfig);
  }

  public setTimeFormat(timeFormat) {
    this.timelineConfig.dateFormat = timeFormat;
    this.timelineConfig = Object.assign({}, this.timelineConfig);
  }
}
