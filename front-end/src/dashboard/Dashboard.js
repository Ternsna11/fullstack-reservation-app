import React, { useEffect, useState } from "react";
import { listReservations, listTables, finishTable, cancelReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservations from "./Reservations";
import Tables from "./Tables";
import { today, next, previous, formatDate } from "../utils/date-time";
import { useLocation } from "react-router";

function Dashboard() {
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const query = useQuery();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [date, setDate] = useState(query.get("date") || today());
  useEffect(loadDashboard, [date]);

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  function loadDashboard() {
    const abortController = new window.AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables().then(setTables);
    return () => abortController.abort();
  }

  function onCancel(reservation_id) {
    cancelReservation(reservation_id)
      .then(loadDashboard)
      .catch(setReservationsError);
  }

  function onFinish(table_id, reservation_id) {
    finishTable(table_id, reservation_id).then(loadDashboard);
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <h1 className="m-3">{formatDate(date)}</h1>
      <button
        onClick={() => setDate(previous(date))}
        className="btn btn-sm btn-light"
      >
        Previous Day
      </button>
      <button
        className="mx-3 btn btn-sm btn-light"
        onClick={() => setDate(today())}
      >
        Today
      </button>
      <button
        onClick={() => setDate(next(date))}
        className="btn btn-sm btn-light"
      >
        Next Day
      </button>
      <br />
      <label htmlFor="reservation_date" className="form-label m-3">
        <input
          type="date"
          pattern="\\d{4}-\\d{2}-\\d{2}"
          name="reservation_date"
          onChange={handleDateChange}
          value={date}
        />
      </label>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0 text-primary">Reservations</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <Reservations reservations={reservations} onCancel={onCancel} />
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Tables</h4>
      </div>
      <Tables onFinish={onFinish} tables={tables} />
    </main>
  );
}

export default Dashboard;
