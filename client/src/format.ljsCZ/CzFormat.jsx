const czDataFormat = (number, index, totalSec) => {

    return [
      ['právě teď', 'right now'],
      ['před %s sekundama', 'in %s seconds'],
      ['před jednou minutou ', 'in 1 minute'],
      ['před %s minutama', 'in %s minutes'],
      ['před jednou hodinou', 'in 1 hour'],
      ['před %s hodinama', 'in %s hours'],
      ['před jedním dnem', 'in 1 day'],
      ['před %s dněmi', 'in %s days'],
      ['před jedním týdnem', 'in 1 week'],
      ['před %s týdnama', 'in %s weeks'],
      ['před jendím měsícem', 'in 1 month'],
      ['před %s měsícemi', 'in %s months'],
      ['před jendím rokem', 'in 1 year'],
      ['před %s lety', 'in %s years']
    ][index];
};

export default czDataFormat;