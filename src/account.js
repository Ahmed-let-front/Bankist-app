'use strict';
import './css/style.css';
const elements = {
  labelWelcome: document.querySelector('.welcome'),
  header: document.querySelector('.acct-header'),
  labelDate: document.querySelector('.date'),
  labelBalance: document.querySelector('.balance__value'),
  labelSumIn: document.querySelector('.value--in'),
  labelSumOut: document.querySelector('.value--out'),
  labelSumInterest: document.querySelector('.value--interest'),
  labelTimer: document.querySelector('.timer'),
  containerApp: document.querySelector('.app'),
  containerMovements: document.querySelector('.movements'),
  btnLogin: document.querySelector('.login__btn'),
  btnTransfer: document.querySelector('.form__btn--transfer'),
  btnLoan: document.querySelector('.form__btn--loan'),
  btnClose: document.querySelector('.form__btn--close'),
  btnSort: document.querySelector('.btn--sort'),
  btnBackHome: document.querySelector('.back-home'),
  inputLoginUsername: document.querySelector('.login__input--user'),
  inputLoginPin: document.querySelector('.login__input--pin'),
  inputTransferTo: document.querySelector('.form__input--to'),
  inputTransferAmount: document.querySelector('.form__input--amount'),
  inputLoanAmount: document.querySelector('.form__input--loan-amount'),
  inputCloseUsername: document.querySelector('.form__input--user'),
  inputClosePin: document.querySelector('.form__input--pin'),
};
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2026-06-05T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-US',
};
const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2026-06-05T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const accounts = [account1, account2];
(() => {
  const data = localStorage.getItem('registeredUser');
  if (!data) return;
  const userData = JSON.parse(data);
  const newAccUser = {
    owner: userData.fullName,
    movements: [1450, 455.23, -306.5, 2500, 642.21, -133, 79.97, 300],
    interestRate: 1.9,
    pin: userData.PINValue,
    movementsDates: [
      '2026-11-01T13:15:33.035Z',
      '2026-11-30T09:48:16.867Z',
      '2026-12-25T06:04:23.907Z',
      '2026-01-25T14:18:46.235Z',
      '2026-02-05T16:33:06.386Z',
      '2026-04-10T14:43:26.374Z',
      '2026-06-01T18:49:59.371Z',
      '2026-06-05T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
  };
  accounts.push(newAccUser);
})();
const convertCurrencies = (number, currency, locale) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'narrowSymbol',
  }).format(number);
let currentAccount;
const createUsernames = function (accs) {
  return accs.map(acc => ({
    ...acc,
    username: acc.owner.split(' ')[0],
  }));
};
const updateAccs = createUsernames(accounts);
const getUserData = (domELs, type = 'login') => {
  const usernameEl = type === 'login' ? domELs.inputLoginUsername : domELs.inputCloseUsername;
  const pinEl = type === 'login' ? domELs.inputLoginPin : domELs.inputClosePin;
  return {
    userName: usernameEl.value.trim(),
    pin: +pinEl.value.trim(),
  };
};
const displayMainEl = currAcc => {
  elements.containerApp.classList.remove('hidden-content');
  const firstName = currAcc.owner.split(' ')[0];
  elements.labelWelcome.textContent = `Welcome Back, ${firstName}`;
};
const returnUserAcc = (username, pin) => updateAccs.find(acc => acc.username === username && acc.pin === pin);
const processMovDate = (date, acc) => {
  const calcDayesPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  let ISOString = date.toISOString();
  const daysPassed = calcDayesPassed(date, new Date());
  if (daysPassed <= 7) {
    const dataString = new Intl.RelativeTimeFormat(acc.locale, {
      numeric: 'auto',
    }).format(-daysPassed, 'day');
    return { ISOString, dataString };
  }
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const dataString = new Intl.DateTimeFormat(acc.locale, options).format(date);
  return { ISOString, dataString };
};
const processSortMovements = (acc, shouldSort) => {
  return shouldSort
    ? {
        ...acc,
        combindedDates: acc.combindedDates.toSorted((a, b) => a.movements - b.movements),
      }
    : { ...acc };
};
const processDispalyMovments = acc => {
  let html = '';
  updateAccs.forEach(
    obj =>
      (obj.combindedDates = obj.movements.map((mov, i) => ({
        movements: mov,
        date: obj.movementsDates[i],
      }))),
  );
  acc.combindedDates.forEach((obj, i) => {
    const { movements, date } = obj;
    const { ISOString, dataString } = processMovDate(new Date(date), acc);
    const type = movements > 0 ? 'deposit' : 'withdrawal';
    html += `
      <li class="movements__row">
        <div class="status">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <time datetime="${ISOString}" class="movements__date capitalize">${dataString}</time>
        </div>
        <span class="movements__value">${convertCurrencies(movements.toFixed(2), acc.currency, acc.locale)}</span>
      </li>`;
  });
  return html;
};
const displayMovements = (acc, elListOfMovements) => {
  elListOfMovements.innerHTML = '';
  const html = processDispalyMovments(acc);
  elListOfMovements.insertAdjacentHTML('afterbegin', html);
};
const displayBalance = (acc, elBalance) => {
  let balance = acc.movements.reduce((acc, curr) => acc + curr, 0).toFixed(2);
  balance = convertCurrencies(balance, acc.currency, acc.locale);
  elBalance.textContent = balance;
};
const displayInLabel = (acc, elInSummary) => {
  let sumIn = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr, 0)
    .toFixed(2);
  sumIn = convertCurrencies(sumIn, acc.currency, acc.locale);
  elInSummary.textContent = sumIn;
};
const displayOutLabel = (acc, elOutSummary) => {
  let sumOut = Math.abs(
    acc.movements
      .filter(mov => mov < 0)
      .reduce((acc, curr) => acc + curr, 0)
      .toFixed(2),
  );
  sumOut = convertCurrencies(sumOut, acc.currency, acc.locale);
  elOutSummary.textContent = sumOut;
};
const processDispalyInterst = acc => {
  const rate = acc.interestRate;
  const atLeast = 1;
  const calcInterest = mov => (mov * rate) / 100;
  let SumInterest = acc.movements
    .filter(mov => mov > 0 && calcInterest(mov) >= atLeast)
    .map(mov => calcInterest(mov))
    .reduce((acc, int) => acc + int, 0)
    .toFixed(2);
  SumInterest = convertCurrencies(SumInterest, acc.currency, acc.locale);
  return SumInterest;
};
const displayInterstLabel = (acc, elInterstSummary) => {
  const SumInterest = processDispalyInterst(acc);
  elInterstSummary.textContent = SumInterest;
};
const displaySummary = acc => {
  displayInLabel(acc, elements.labelSumIn);
  displayOutLabel(acc, elements.labelSumOut);
  displayInterstLabel(acc, elements.labelSumInterest);
};
const displayUi = acc => {
  displaySummary(acc);
  displayBalance(acc, elements.labelBalance);
  displayMovements(acc, elements.containerMovements);
};
const processLabelDate = acc => {
  const now = new Date();
  const options = {
    year: 'numeric',
    day: '2-digit',
    month: '2-digit',
    hour: 'numeric',
    hour12: true,
    minute: '2-digit',
  };
  const dataString = new Intl.DateTimeFormat(acc.locale, options).format(now);
  const isoDate = now.toISOString();
  return { dataString, isoDate };
};
const displayLabelDate = (label, acc) => {
  const { dataString, isoDate } = processLabelDate(acc);
  label.textContent = dataString;
  label.setAttribute('datetime', isoDate);
};
const initInputs = (...inputs) => {
  inputs.forEach(input => (input.value = ''));
};
const closeAcc = () => {
  elements.containerApp.classList.add('hidden-content');
  elements.labelWelcome.textConten = 'Log in to get started';
};
let timeCount;
const timer = timeSeconds => {
  let time = timeSeconds;
  const tick = () => {
    const min = String(Math.floor(time / 60)).padStart(2, '0');
    const sec = String(Math.floor(time % 60)).padStart(2, '0');
    elements.labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timeCount);
      closeAcc();
    }
    time--;
  };
  tick();
  timeCount = setInterval(tick, 1000);
};
elements.btnLogin.addEventListener('click', e => {
  e.preventDefault();
  elements.containerApp.classList.add('duration-1000', 'transition-[opacity,translate]');
  const { userName, pin } = getUserData(elements);
  currentAccount = returnUserAcc(userName, pin);
  if (!currentAccount) return;
  if (timeCount) clearInterval(timeCount);
  timer(300);
  displayMainEl(currentAccount);
  displayLabelDate(elements.labelDate, currentAccount);
  displayUi(currentAccount);
  initInputs(elements.inputLoginUsername, elements.inputLoginPin);
});
const processTransfer = () => {
  const toUsername = elements.inputTransferTo.value.trim();
  const amountTransfer = +elements.inputTransferAmount.value;
  const toUserAcc = updateAccs.find(acc => acc.username === toUsername);
  const balanceValue = +elements.labelBalance.textContent.replace(/[^0-9.]/g, '');
  const isValidTransfer =
    toUserAcc &&
    amountTransfer >= 1 &&
    balanceValue >= amountTransfer &&
    toUserAcc.username !== currentAccount.username;
  return {
    toUsername,
    amountTransfer,
    isValidTransfer,
    toUserAcc,
    balanceValue,
  };
};
elements.btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const data = processTransfer();
  if (data.isValidTransfer) {
    if (timeCount) clearInterval(timeCount);
    timer(300);
    currentAccount.movements.push(-Math.abs(data.amountTransfer));
    currentAccount.movementsDates.push(new Date().toISOString());
    data.toUserAcc.movements.push(data.amountTransfer);
    data.toUserAcc.movementsDates.push(new Date().toISOString());
    displayUi(currentAccount);
    initInputs(elements.inputTransferTo, elements.inputTransferAmount);
  }
});
const processLoan = () => {
  const loanAmount = Math.floor(elements.inputLoanAmount.value);
  const loanRateThreshold = 0.1;
  const requiredDepositAmount = loanAmount * loanRateThreshold;
  const hasValidLoanLogic = () => {
    const deposits = currentAccount.movements.filter(mov => mov > 0);
    return deposits.some(deposit => deposit >= requiredDepositAmount && loanAmount >= 1);
  };
  return { loanAmount, hasValidLoanLogic };
};
elements.btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const loanData = processLoan();
  if (loanData.hasValidLoanLogic()) {
    if (timeCount) clearInterval(timeCount);
    timer(300);
    currentAccount.movements.push(loanData.loanAmount);
    currentAccount.movementsDates.push(new Date().toISOString());
    displayUi(currentAccount);
    initInputs(elements.inputLoanAmount);
  }
});
const processClose = closeAcc => {
  const userCloseAccIndex = updateAccs.indexOf(closeAcc);
  if (userCloseAccIndex !== -1) updateAccs.splice(userCloseAccIndex, 1);
};
elements.btnClose.addEventListener('click', e => {
  e.preventDefault();
  const { userName, pin } = getUserData(elements, 'close');
  const userCloseAcc = returnUserAcc(userName, pin);
  if (userCloseAcc) {
    clearInterval(timeCount);
    processClose(userCloseAcc);
    if (currentAccount === userCloseAcc) {
      elements.containerApp.classList.add('hidden-content');
      elements.labelWelcome.textContent = 'Log in to get started';
    }
    initInputs(elements.inputCloseUsername, elements.inputClosePin);
  }
});
elements.btnBackHome.addEventListener('click', e => {
  e.preventDefault();
  window.location.href = './index.html';
});

elements.btnSort.addEventListener('click', e => {
  e.preventDefault();
  const isCurrentlySorted = elements.btnSort.dataset.sorted === 'true';
  const nextSortedState = !isCurrentlySorted;
  elements.btnSort.dataset.sorted = String(nextSortedState);
  const sortedAccount = processSortMovements(currentAccount, nextSortedState);
  displayMovements(sortedAccount, elements.containerMovements);
});
