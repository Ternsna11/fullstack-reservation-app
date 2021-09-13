import React from "react";
import { Link } from "react-router-dom";

function Reservations({onCancel, reservations = [] }) {
  function cancelHandler({
      target: { dataset: { reservationIdCancel } } = {},
  }) {
      if (
        reservationIdCancel &&
        window.confirm(
          "Do you want to cancel this reservation? This cannot be undone."
        )
      ) {
        onCancel(reservationIdCancel);
      }
  }
  const rows = reservations.length ? (
    reservations.map((reservation) => {
      return (
        <div className="form-group row" key={reservation.reservation_id}>
          <div className="col-sm-1">{reservation.reservation_id}</div>
          <div className="col-sm-1">{reservation.first_name}, {reservation.last_name}</div>
          <div className="col-sm-1">{reservation.mobile_number}</div>
          <div className="col-sm-1">{reservation.reservation_date}</div>
          <div className="col-sm-1">{reservation.reservation_time}</div>
          <div className="col-sm-1">{reservation.people}</div>
          <div className="col-sm-1" data-reservation-id-status={reservation.reservation_id}>{reservation.status}</div>
          {reservation.status === "booked" ? (
              <div className="col-sm-1">
                <Link className="btn btn-info m-1" to={`/reservations/${reservation.reservation_id}/seat`}>seat</Link>
                <Link className="btn btn-success m-1" to={`/reservations/${reservation.reservation_id}/edit`}>edit</Link>
                {/* <Link className="btn btn-danger" to={`/reservations/${reservation.reservation_id}/cancel`}>cancel</Link> */}
                <button type="button" className="btn btn-danger m-1" data-reservation-id-cancel={reservation.reservation_id} onClick={cancelHandler}>Cancel</button>
              </div>
          ) : ( "" )}
        </div>
      );
    })
    ) : (
    <div>No reservations found</div>
  );
  return (
      <div className="table">
      {rows}
      </div>
  )
}

export default Reservations;
