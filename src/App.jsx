import {useReducer } from "react";
import "./App.scss";
import moment from "moment";


function App() {
  const [state, dispatch] = useReducer(
    (state, action) => ({
      ...state,
      ...action,
    }),
    {
      is_wrong_date: false,
      error_wrong_date: "",
      day: "",
      month: "",
      year: "",
      error_day: "",
      error_month: "",
      error_year: "",
      dateDiff: {
        days: "--",
        months: "--",
        years: "--"
      }
    }
  );

  function handleDateDiff(date) {
    // Convert both dates to milliseconds
    var date1_ms = new Date(date);
    var date2_ms = Date.now();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;

    // Convert back to days, months, and years
    var one_day = 1000 * 60 * 60 * 24;
    var one_month = one_day * 30;
    var one_year = one_month * 12;

    var years = Math.floor(difference_ms / one_year);
    difference_ms = difference_ms % one_year;

    var months = Math.floor(difference_ms / one_month);
    difference_ms = difference_ms % one_month;

    var days = Math.floor(difference_ms / one_day);

    return {
      years: years,
      months: months,
      days: days
    };
  }

  function isValidDate(date, number) {
    return date === "" || date < 0 || date > number;
  }

  function handleSubmit(e) {
    e.preventDefault();

    let validDay = isValidDate(state.day, 31);
    let validMonth = isValidDate(state.month, 12);
    let validYear = isValidDate(state.year, new Date().getFullYear());

    const isSomethingWrong = validDay || validMonth || validYear;


    let space = "This field is required";

    let error_day = "";
    if (validDay)
      error_day = state.day === "" ? space : "Must be a valid day";

    let error_month = "";
    if (validMonth)
      error_month = state.month === "" ? space : "Must be a valid month";

    let error_year = "";
    if (validYear)
      error_year = state.year === "" ? space : "Must be in the past";

   


    // Somethng is wrong in one of three input
    let temp = isSomethingWrong ? "--" : `${state.year}-${state.month}-${state.day}`;
    let date = moment(temp, "YYYY-MM-DD");
    let is_wrong_date = !date.isValid();

    const error_wrong_date = isSomethingWrong ? false : !is_wrong_date ? false : <p>Must be a valid date</p>;

    let action = {
      error_day,
      error_month,
      error_year,
      error_wrong_date,
      is_wrong_date
    };

    action = is_wrong_date ? action : { ...action, dateDiff: handleDateDiff(temp) };

    dispatch(action);
  }

  return (
    <main>
      <div className="container">
        <form onSubmit={handleSubmit} className="form">
          <div className={state.is_wrong_date ? "input-date wrong" : "input-date"}>
            <label htmlFor="input-day">DAY</label>
            <label htmlFor="input-month">MONTH</label>
            <label htmlFor="input-year">YEAR</label>
          </div>
          <div className={state.is_wrong_date ? "user-input wrong" : "user-input"}>
            <input
              id="input-day"
              type="text"
              placeholder="DD"
              value={state.day}
              onChange={(e) => dispatch({ day: e.target.value })}
              autoComplete="off"
            />
            <input
              id="input-month"
              type="text"
              placeholder="MM"
              value={state.month}
              onChange={(e) => dispatch({ month: e.target.value })}
              autoComplete="off"
            />
            <input
              id="input-year"
              type="text"
              placeholder="YYYY"
              value={state.year}
              onChange={(e) => dispatch({ year: e.target.value })}
              autoComplete="off"
            />
          </div>
          <div className="input-error">
            {state.error_wrong_date}
            <p>{state.error_day}</p>
            <p>{state.error_month}</p>
            <p>{state.error_year}</p>
          </div>
          <div className="line">
            <button aria-label="Submit button" title="Submit btutton" className="submit-btn"></button>
          </div>
        </form>
        <div className="display-date">
          <p className="year">
            <span className="number">{!state.is_wrong_date ? state.dateDiff.years : "--"}</span> years
          </p>
          <p className="month">
            <span className="number">{!state.is_wrong_date ? state.dateDiff.months : "--"}</span> months
          </p>
          <p className="day">
            <span className="number">{!state.is_wrong_date ? state.dateDiff.days : "--"}</span> days
          </p>
        </div>
      </div>
    </main>
  );
}

export default App;
