txtParser = function(text) {

  // constants
  var keywords = ["#BANK", "@BANK"];
  var action = ["transfer", "pay", "send", "balance", "received"];
  var sources = ["from"];
  var dest = ["to"];

  // initial return value
  var json = {};

  // logic
  if (!getByKeyword(keywords)) return null;
  json.action = getByPrefix(text, action);
  source = getByPreword(text, sources);
  if (source) json.source = source;
  amount = getAmount(text);
  if (amount) json.amount = amount;
  destination = getByPreword(text, dest);
  if (destination) json.destination = destination;
  return json;

  // private helper function
  function getByKeyword(keywords) {
    var res = false;
    keywords.forEach(function(keyword) {
      if (!res && text.toUpperCase().indexOf(keyword.toUpperCase()) !== -1) {
        res = true;
      }
    });
    return res;
  }

  // private helper function
  function getByPrefix(text, tag) {
    var val = null;
    for (var i = 0; i < tag.length; i++) {
      if (text.indexOf(tag[i]) !== -1) {
        val = tag[i];
        break;
      }
    }
    return val;
  }

  // private helper function
  function getAmount(text) {
    match = text.match(/\$\w+\.?\w+/);
    return (match) ? match[0].substr(1) : null;
  }

  // private helper function
  function getByPreword(text, tag) {
    var val = null;
    for (var i = 0; i < tag.length; i++) {
      re = new RegExp("\\b" + tag[i] + "\\s[^b]\\w+").exec(text);
      match = text.match(re);
      if (match) {
        val = match[0].substr(tag[i].length + 1);
        break;
      }
    }
    return val;
  }


};

var decision = function(json, accounts) {

  // functional decoraters
  accounts.$add = function(amt, acct) {
    this[acct].balance = parseFloat(parseFloat(this[acct].balance) + parseFloat(amt)).toFixed(2);
  };
  accounts.$substr = function(amt, acct) {
    this[acct].balance = parseFloat(this[acct].balance - parseFloat(amt)).toFixed(2);
  };
  accounts.$getAccountNames = function() {
    acct = [];
    for (var key in this) {
      if (key.indexOf("$") === -1)
        acct.push(key);
    }
    return acct;
  };

  // action commands
  if (!json) return null;
  action = null;
  switch (json.action) {
    case "transfer":
    case "pay":
    case "send":
    case "received":
      action = actions.transfer(json.source, json.amount, json.destination, accounts);
      break;
    case "balance":
      action = actions.balance(json.source, accounts);
      break;
    default:
      action = {
        message: "format is '#TD [action] from [source] (to [destination])' "
      };
      break;
  }
  return action;

};

var actions = {

  transfer: function(source, amount, destination, accounts) {
    if (!source) return {
      message: "Source is missing; options are '" + accounts.$getAccountNames() + "'"
    };
    if (!destination) return {
      message: "Destination is missing; options are a user (e.g. @john) or '" + accounts.$getAccountNames() + "'"
    };
    if (source.indexOf("@") === -1) {
      accounts.$substr(amount, source);
    }
    if (destination.indexOf("@") === -1) {
      accounts.$add(amount, destination);
    }
    return {
      message: "transferred $" + amount + " from " + source + " to " + destination
    };
  },

  balance: function(source, accounts) {
    if (source) {
      msg = "your " + source + " account balance is: " + accounts[source].balance;
    } else {
      msg = "your account balances are: ";
      for (var key in accounts) {
        if (key.indexOf("$") === -1)
          msg += "\n\t\t" + key + ":\t$" + accounts[key].balance;
      }
    }
    return {
      message: msg
    };
  },

};