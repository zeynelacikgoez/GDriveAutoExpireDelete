function parseExpiryTag(fileName) {
  var match = fileName.match(/#expire(\d+)(d|w|m|y)?/);
  if (match) {
    var amount = parseInt(match[1], 10);
    var unit = match[2] || 'd';
    return { amount, unit };
  }
  return null;
}

function calculateExpiryDate(createdDate, amount, unit) {
  var expiryDate = new Date(createdDate);
  switch (unit) {
    case 'd':
      expiryDate.setDate(expiryDate.getDate() + amount);
      break;
    case 'w':
      expiryDate.setDate(expiryDate.getDate() + amount * 7);
      break;
    case 'm':
      expiryDate.setMonth(expiryDate.getMonth() + amount);
      break;
    case 'y':
      expiryDate.setFullYear(expiryDate.getFullYear() + amount);
      break;
  }
  return expiryDate;
}
