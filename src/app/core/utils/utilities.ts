import { Injectable } from "@angular/core";
import { ShepherdService } from "angular-shepherd";
import { tourServices } from "../services/tour.sevices";
import tourDefaultOptions from "../../../assets/json/common-metadata.json";
import { Router } from "@angular/router";
import { DEFAULT_CONFIG, platform } from "src/config/default";
import { DatePipe } from "@angular/common";

@Injectable({
  providedIn: 'root'
})

export class Utilities {
  private tourOptions: any = tourDefaultOptions.defaultTourStepOptions;

  constructor(
    private shepherdService: ShepherdService,
    private tourServices: tourServices,
    private router: Router,
    private datePipe: DatePipe) { }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  base64_decode(encodedData) {
    // eslint-disable-line camelcase
    // tslint:disable-next-line:prefer-const
    var b64 =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1;
    var o2;
    var o3;
    var h1;
    var h2;
    var h3;
    var h4;
    var bits;
    var i = 0;
    var ac = 0;
    var dec = "";
    var tmpArr = [];

    if (!encodedData) {
      return encodedData;
    }

    encodedData += "";

    do {
      // unpack four hexets into three octets using index points in b64
      h1 = b64.indexOf(encodedData.charAt(i++));
      h2 = b64.indexOf(encodedData.charAt(i++));
      h3 = b64.indexOf(encodedData.charAt(i++));
      h4 = b64.indexOf(encodedData.charAt(i++));

      bits = (h1 << 18) | (h2 << 12) | (h3 << 6) | h4;

      o1 = (bits >> 16) & 0xff;
      o2 = (bits >> 8) & 0xff;
      o3 = bits & 0xff;

      if (h3 === 64) {
        tmpArr[ac++] = String.fromCharCode(o1);
      } else if (h4 === 64) {
        tmpArr[ac++] = String.fromCharCode(o1, o2);
      } else {
        tmpArr[ac++] = String.fromCharCode(o1, o2, o3);
      }
    } while (i < encodedData.length);

    dec = tmpArr.join("");

    return decodeURIComponent(escape(dec.replace(/\0+$/, "")));
  }
  replaceSpecialCharacters(str: string, replacement: any) {
    return str && str.length
      ? str.replace(/[^a-zA-Z0-9]/g, replacement).toLowerCase()
      : str;
  }
  workingDaysBetweenDates(d0, d1, holidays: any = []) {

    /* Two working days and an sunday (not working day) */
    // var holidays = ['2016-05-03', '2016-05-05', '2016-05-07'];
    let startDate: any = this.parseDate(d0);
    let endDate: any = this.parseDate(d1);

    // Validate input
    if (endDate < startDate) {
      return 0;
    }

    // Calculate days between dates
    let millisecondsPerDay = 86400 * 1000; // Day in milliseconds
    startDate.setHours(0, 0, 0, 1);  // Start just after midnight
    endDate.setHours(23, 59, 59, 999);  // End just before midnight
    let diff = endDate - startDate;  // Milliseconds between datetime objects
    let days = Math.ceil(diff / millisecondsPerDay);

    // Subtract two weekend days for every week in between
    let weeks = Math.floor(days / 7);
    days -= weeks * 2;

    // Handle special cases
    let startDay = startDate.getDay();
    let endDay = endDate.getDay();

    // Remove weekend not previously removed.
    if (startDay - endDay > 1) {
      days -= 2;
    }
    // Remove start day if span starts on Sunday but ends before Saturday
    if (startDay == 0 && endDay != 6) {
      days--;
    }
    // Remove end day if span ends on Saturday but starts after Sunday
    if (endDay == 6 && startDay != 0) {
      days--;
    }
    /* Here is the code */
    holidays.forEach(day => {
      if ((day >= d0) && (day <= d1)) {
        /* If it is not saturday (6) or sunday (0), substract it */
        if ((this.parseDate(day).getDay() % 6) != 0) {
          days--;
        }
      }
    });
    return days;
  }
  endDateFromDuration(sDate, duration) {
    let startDate: any = this.parseDate(sDate);
    let edate = new Date(startDate);
    for (let index = 0; index < duration; index++) {
      edate.setDate(startDate.getDate() + index);
      let dy = edate.getDay();
      // Remove start day if span starts on Sunday but ends before Saturday
      if (dy == 0 || dy == 6) {
        duration++;
      }
    }
    return edate;

  }
  parseDate(input) {
    // Transform date from text to date
    var parts = input.match(/(\d+)/g);
    // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  dateDiff(startDt, endDt) {
    /* Two working days and an sunday (not working day) */
    // var holidays = ['2016-05-03', '2016-05-05', '2016-05-07'];
    let startDate: any = this.parseDate(startDt);
    let endDate: any = this.parseDate(endDt);

    // Validate input
    if (endDate < startDate) {
      return 0;
    }

    // Calculate days between dates
    let millisecondsPerDay = 86400 * 1000; // Day in milliseconds
    // startDate.setHours(0, 0, 0, 1);  // Start just after midnight
    // endDate.setHours(23, 59, 59, 999);  // End just before midnight
    let diff = endDate - startDate;  // Milliseconds between datetime objects
    let days = Math.ceil(diff / millisecondsPerDay);

    return days;
  }

  dateInTwoDigit(date) {
    var d = new Date(date);
    date = [
      d.getFullYear(),
      ('0' + (d.getMonth() + 1)).slice(-2),
      ('0' + d.getDate()).slice(-2)
    ].join('-');
    return date;
  };

  days_between(date1, date2) {

    date1 = new Date(date1.split(" ")[0]);
    date2 = new Date(date2.split(" ")[0]);

    // The number of milliseconds in one day
    const ONE_DAY = 1000 * 60 * 60 * 24;

    // Calculate the difference in milliseconds
    const differenceMs = Math.abs(date1 - date2);

    // Convert back to days and return
    return Math.round(differenceMs / ONE_DAY) + 1;

  }

  date_diff_indays = function (date1, date2) {
    let dt1 = new Date(date1.split(" ")[0]);
    let dt2 = new Date(date2.split(" ")[0]);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
  }

  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var binary = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: mimeString });
  }

  isNumeric(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }


  formatNewDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = month;
    if (day.length < 2)
      day = '0' + day;
    var months = new Array();
    months[0] = "Jan";
    months[1] = "Feb";
    months[2] = "Mar";
    months[3] = "Apr";
    months[4] = "May";
    months[5] = "Jun";
    months[6] = "Jul";
    months[7] = "Aug";
    months[8] = "Sep";
    months[9] = "Oct";
    months[10] = "Nov";
    months[11] = "Dec";
    return [day, months[month], year].join('-');
  }
  formatOppNewDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth()),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = month;
    if (day.length < 2)
      day = '0' + day;
    var months = new Array();
    months[0] = "Jan";
    months[1] = "Feb";
    months[2] = "Mar";
    months[3] = "Apr";
    months[4] = "May";
    months[5] = "Jun";
    months[6] = "Jul";
    months[7] = "Aug";
    months[8] = "Sep";
    months[9] = "Oct";
    months[10] = "Nov";
    months[11] = "Dec";
    return [day, months[month], year].join('-');
  }




  lightOrDark(color) {

    // Variables for red, green, blue values
    var r, g, b, hsp;

    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

      // If HEX --> store the red, green, blue values in separate variables
      color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

      r = color[1];
      g = color[2];
      b = color[3];
    }
    else {

      // If RGB --> Convert it to HEX: http://gist.github.com/983661
      color = +("0x" + color.slice(1).replace(
        color.length < 5 && /./g, '$&$&'));

      r = color >> 16;
      g = color >> 8 & 255;
      b = color & 255;
    }

    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
      0.299 * (r * r) +
      0.587 * (g * g) +
      0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    if (hsp > 127.5) {

      return 'light';
    }
    else {

      return 'dark';
    }
  }

  convertDateFormatDDMM(date) {
    var months = new Array();
    months[0] = "Jan";
    months[1] = "Feb";
    months[2] = "Mar";
    months[3] = "Apr";
    months[4] = "May";
    months[5] = "Jun";
    months[6] = "Jul";
    months[7] = "Aug";
    months[8] = "Sep";
    months[9] = "Oct";
    months[10] = "Nov";
    months[11] = "Dec";
    return `${date.day}-${months[date.month - 1]}`;
  }


  // convert Json to CSV data in Angular2
  ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var row = "";

    for (var index in objArray[0]) {
      //Now convert each value to string and comma-separated
      row += index + ',';
    }
    row = row.slice(0, -1);
    //append Label row with line break
    str += row + '\r\n';

    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ','

        let value = array[i][index];
        line += typeof value === 'string' ? value.replace(",", " &") : value;
      }
      str += line + '\r\n';
    }
    return str;
  }

  getRangeOfTwoNumbers(low, high) {
    var list = [];
    for (var i = low; i <= high; i++) {
      list.push(i);
    }
    return list;
  }

  getMonthAndYear() {
    var d = new Date();
    var n = d.getFullYear();
    let year_ranges = this.getRangeOfTwoNumbers(2018, n);
    return { month: { "JAN": 1, "FEB": 2, "MAR": 3, "ARP": 4, "MAY": 5, "JUN": 6, "JUL": 7, "AUG": 8, "SEP": 9, "OCT": 10, "NOV": 11, "DEC": 12 }, year: year_ranges.reverse() }
  }

  toDateStr(year, month, day) {
    if (day < 10)
      day = "0" + day;

    if (month < 10)
      month = "0" + month;

    return year + "-" + month + "-" + day;
  }

  padNumber(number) {
    var string = '' + number;
    string = string.length < 2 ? '0' + string : string;
    return string;
  }

  addSubtractDaysInDate(input_date, add_days, operation = 'ADD') {
    const date = new Date(input_date);
    const next_date = (operation == 'ADD') ? new Date(date.setDate(date.getDate() + add_days)) : new Date(date.setDate(date.getDate() - add_days));
    const formatted = next_date.getUTCFullYear() + '-' + this.padNumber(next_date.getUTCMonth() + 1) + '-' + this.padNumber(next_date.getUTCDate())
    return formatted;
  }


  onHelpClicked(path: any, defaultSteps: any) {
    if (path) {
      let tour = document.querySelector('.shepherd-has-cancel-icon');
      if (tour) {
        this.shepherdService.cancel()
      }
      this.shepherdService.defaultStepOptions = this.tourOptions;
      this.shepherdService.modal = true;
      this.shepherdService.confirmCancel = false;
      this.shepherdService.addSteps(defaultSteps);
      this.shepherdService.start();
    }
  }

  routeTo(id: any, key: any) {
    switch (key) {
      case 'requester_detail':
        this.router.navigate(['requester', 'trip-requested-detail', id]);
        break;
      case 'user_detail':
        this.router.navigate(['profile', id]);
        break;
      case 'edit_trip':
        this.router.navigate(['requester', 'edit-trip', id]);
        break;
      case 'trip_success':
        this.router.navigate(['requester', 'trip-success', id]);
        break;
      case 'compliance_supervisor':
        this.router.navigate(['compliance-supervisor', 'trip-list']);
        break;
      case 'truck_list':
        this.router.navigate(['compliance-supervisor', 'truck-checklist', id]);
        break;
      case 'compliance_assistant':
        this.router.navigate(['compliance-assistant', 'trip-list']);
        break;
      case 'compliance_assistant_truck_list':
        this.router.navigate(['compliance-assistant', 'truck-list', id]);
        break;
      case 'driver_detail':
        this.router.navigate(['driver', 'driver-detail', id]);
        break;
      default:
        console.log(`Sorry, we are can't find any route.`);
    }
  }


  toggle_currency(is_usd: boolean, data: any) {
    if (is_usd) {
      data[0].cost_share = data[0].cost_share / 3.75;
    }
    else if (!is_usd) {
      data[0].cost_share = data[0].cost_share * 3.75;
    }
  }


  change_time_format(timestamp: any) {
    var parts = timestamp.split(' ');

    // Split the time part into hours, minutes, and seconds
    var timeParts = parts[1].split(':');
    var hours = parseInt(timeParts[0], 10);
    var minutes = parseInt(timeParts[1], 10);
    var seconds = parseInt(timeParts[2], 10) || 0; // If seconds not provided, default to 0

    // Check if it's PM and not 12 PM, then add 12 to hours
    if (parts[2] === 'PM' && hours !== 12) {
      hours += 12;
    }

    // If it's AM and 12 AM, set hours to 0
    if (parts[2] === 'AM' && hours === 12) {
      hours = 0;
    }

    // Format hours, minutes, and seconds to ensure leading zeros if needed
    var formattedHours = ('0' + hours).slice(-2);
    var formattedMinutes = ('0' + minutes).slice(-2);
    var formattedSeconds = ('0' + seconds).slice(-2);

    // Return the date along with time in 24-hour format
    return parts[0] + ' ' + formattedHours + ':' + formattedMinutes + ':' + formattedSeconds;
  }


  get_ddmmyyyytt_from_date_string(date_input: any) {
    const date_string = date_input

    // Parse the date string into a Date object
    const date = new Date(date_string);

    // Extract day, month, and year
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-based in JavaScript
    const year = date.getFullYear();

    // Format the date into the desired format
    const formatted_date = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year} 00:00`;

    return formatted_date;
  }


  formatDateYYYYMMDD(dateString: any) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  getFifteenDaysDateRange() {
    // ! logic is being change from 15 days to 3 months
    // const currentDate = new Date();
    // const fifteenDaysAgo = new Date(currentDate.getTime() - 15 * 24 * 60 * 60 * 1000);

    const currentDate = new Date();
    const currentDateCopy = new Date(currentDate);
    const pastThreeMonths = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
    const pastDate = new Date(pastThreeMonths.getTime() + (24 * 60 * 60 * 1000));
    return { "from": this.formatDateYYYYMMDD(pastDate), "to": this.formatDateYYYYMMDD(currentDateCopy) };
  }

  getThirtyDaysDateRange() {
    // ! this logic is being changed to past three months despite having name thirtydays
    // const currentDate = new Date();
    // const fifteenDaysAgo = new Date(currentDate.getTime() - 150 * 24 * 60 * 60 * 1000);

    const currentDate = new Date();
    const currentDateCopy = new Date(currentDate);
    const futureThreeMonths = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
    const threeMonthsAgo = new Date(futureThreeMonths.getTime() + (24 * 60 * 60 * 1000));
    return { "from": this.formatDateYYYYMMDD(threeMonthsAgo), "to": this.formatDateYYYYMMDD(currentDateCopy) };
  }

  getFromOneMayDateRange() {
    const fromDate = new Date('2024-05-01');
    const toDate = new Date('2024-11-31');
    return { "from": this.formatDateYYYYMMDD(fromDate), "to": this.formatDateYYYYMMDD(toDate) };
  }


  generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }


  getFutureFifteenDaysDateRange() {
    // ! this logic is being changed to next 3 months in future despite having name fifteen days
    // const currentDate = new Date();
    // const futureFifteenDays = new Date(currentDate.getTime() + 15 * 24 * 60 * 60 * 1000);
    // const futureDate = new Date(futureFifteenDays.getTime() + (24 * 60 * 60 * 1000));
    // return { "from": this.formatDateYYYYMMDD(currentDate), "to": this.formatDateYYYYMMDD(futureDate) };
    const currentDate = new Date();
    const currentDateCopy = new Date(currentDate);
    const futureThreeMonths = new Date(currentDate.setMonth(currentDate.getMonth() + 3));
    const futureDate = new Date(futureThreeMonths.getTime() + (24 * 60 * 60 * 1000));
    return { "from": this.formatDateYYYYMMDD(currentDateCopy), "to": this.formatDateYYYYMMDD(futureDate) };
  }


  getFiveYearsFutureDateRange(): { from: string, to: string } {
    const currentDate = new Date();
    const fiveYearsFuture = new Date(currentDate.getFullYear() + 5, currentDate.getMonth(), currentDate.getDate());
    return { from: this.formatDateYYYYMMDD(currentDate), to: this.formatDateYYYYMMDD(fiveYearsFuture) };
  }


  generateYearsFromCurrentTo2020() {
    const currentYear = new Date().getFullYear();
    const yearsArray = [];
    for (let year = currentYear; year >= 2020; year--) {
      yearsArray.push(year);
    }
    return yearsArray;
  }


  generateYearsFromCurrentToGivenYear(startYear: any) {
    const currentYear = new Date().getFullYear();
    const yearsArray = [];
    for (let year = currentYear; year >= startYear; year--) {
      yearsArray.push(year);
    }
    return yearsArray;
  }


  generateMonthsArray() {
    const monthsArray = [];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    for (let i = 0; i < months.length; i++) {
      const monthObject = {
        name: months[i],
        value: months[i].toUpperCase(),
        number: i + 1
      };
      monthsArray.push(monthObject);
    }
    return monthsArray;
  }


  getCurrentMonthUppercase() {
    var date = new Date();
    var monthIndex = date.getMonth();
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var currentMonthName = monthNames[monthIndex];
    var currentMonthUppercase = currentMonthName.toUpperCase();
    return currentMonthUppercase;
  }


  getCurrentYearFull() {
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    return currentYear;
  }


  getRoleId() {
    // let role = window.localStorage.getItem('HVMS_role_id') ? window.localStorage.getItem('HVMS_role_id') : window.localStorage.getItem('role_id');
    let role = window.localStorage.getItem('HVMS_role_id');
    return role;
  }

  formatDate(date) {
    if (!(date instanceof Date)) {
      console.error("Invalid date object:", date);
      return null;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  formatDocUrl(url: any) {
    let domainUrl = DEFAULT_CONFIG.doc_url;
    url = url.replace(/storage/g, "ns");
    let formattedUrl = domainUrl + url;
    return formattedUrl;
  }


  redirectAtLogout() {
    if (platform == 'nesr_hvms') {
      window.location.href = 'https://oges.nesr.com/auth/login';
    }
    else if (platform == 'nesr_hvms_test') {
      window.location.href = 'https://abcnesr.ogesone.com/auth/login';
    }
    else if (platform == 'nesr_hvms_prod') {
      window.location.href = 'https://opx.nesr.com/auth/login';
    } else {
      window.location.href = window.location.origin;
    }
  }


  checkLoginStatus() {
    let token = window.localStorage.getItem('token');
    let currentUser = JSON.parse(window.localStorage.getItem('currentUser'));
    let roleId = window.localStorage.getItem('HVMS_role_id');
    let userId = window.localStorage.getItem('user_id');
    let appId = window.localStorage.getItem('app_id');
    let roleName = JSON.parse(window.localStorage.getItem('role'));
    let allRoles = JSON.parse(window.localStorage.getItem('roles'));
    let homepageUrl = window.localStorage.getItem('hvms_homepage_url');
    if (!token || !currentUser || !roleId || !userId || !appId || !roleName || !allRoles || !homepageUrl) {
      this.redirectAtLogout();
    }

    if ((window.location.href == 'https://oges.nesr.com/hvms/' || window.location.href == "https://abcnesr.ogesone.com/hvms/" || window.location.href == "https://opx.nesr.com/hvms/") && homepageUrl) {
      if (platform == 'nesr_hvms') {
        let redirectTimeout = setTimeout(() => {
          window.location.href = 'https://oges.nesr.com/hvms/' + homepageUrl;
          clearTimeout(redirectTimeout);
        }, 1000);
      }
      else if (platform == 'nesr_hvms_test') {
        let redirectTimeout = setTimeout(() => {
          window.location.href = 'https://abcnesr.ogesone.com/hvms/' + homepageUrl;
          clearTimeout(redirectTimeout);
        }, 1000);
      }
      else if (platform == 'nesr_hvms_prod') {
        let redirectTimeout = setTimeout(() => {
          window.location.href = 'https://opx.nesr.com/hvms/' + homepageUrl;
          clearTimeout(redirectTimeout);
        }, 1000);
      }
    }
  }


  goBackToPlatform() {
    if (platform == 'nesr_hvms') {
      window.location.href = 'https://oges.nesr.com';
    }
    else if (platform == 'nesr_hvms_test') {
      window.location.href = 'https://abcnesr.ogesone.com';
    }
    else if (platform == 'nesr_hvms_prod') {
      window.location.href = 'https://opx.nesr.com';
    } else {
      window.location.href = window.location.origin;

    }
  }

  convertUtcToLocal(date: any): any {
    const utcDate = new Date(date);
    const timezoneOffset = utcDate.getTimezoneOffset();
    const localDate = new Date(utcDate.getTime() - (timezoneOffset * 60 * 1000));
    const localDateStr = this.datePipe.transform(localDate, 'yyyy-MM-ddTHH:mm');
    return localDateStr;
  }


  makeStrNumberToInt(obj: any) {
    const result = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = obj[key] * 1;
      }
    }
    return result;
  }


  setVersion() {
    let currentVersion: any = DEFAULT_CONFIG.appVersion;
    window.localStorage.setItem('version', currentVersion);
  }


  checkVersion() {
    let sessionVersion = window.localStorage.getItem('version');
    let currentVersion: any = DEFAULT_CONFIG.appVersion;
    if (sessionVersion && sessionVersion != currentVersion) {
      this.router.navigate(['auth/login']);
    }
  }

  getTimeArray(timeArray) {
    const newTimeArray = [];
    const seenDates = new Set();
    for (const datetime of timeArray) {
      if (datetime) {
        const [date, time] = datetime.split(' ');
        if (seenDates.has(date)) {
          newTimeArray.push(time);
        } else {
          newTimeArray.push(datetime);
          seenDates.add(date);
        }
      } else {
        newTimeArray.push(null);
      }
    }

    return newTimeArray;
  }


  extractValueFieldFromArr(arr: any, valueFieldName: any) {
    let resultArr = [];

    for (let i = 0; i < arr.length; i++) {
      resultArr.push(arr[i][valueFieldName]);
    }

    return resultArr;
  }


  removeSeconds(datetime: any) {
    let [date, time] = datetime.split('T');

    let timeWithoutSeconds = time.split(':').slice(0, 2).join(':');

    return `${date}T${timeWithoutSeconds}`;
  }

}
