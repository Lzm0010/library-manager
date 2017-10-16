var formatDate = function(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getUTCDate();
  var monthIndex = date.getUTCMonth();
  var year = date.getUTCFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
};

module.exports = formatDate;
