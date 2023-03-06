import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DatePicker } from 'antd';
import { toast } from 'react-toastify';
import moment from 'moment/moment';
import dayjs from 'dayjs';

function UpdateReservation() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [doctorId, setDoctorId] = useState(
    JSON.parse(localStorage.getItem('reservation')).doctorid,
  );
  const [date, setDate] = useState(
    JSON.parse(localStorage.getItem('reservation')).date,
  );

  const reservation = JSON.parse(localStorage.getItem('reservation'));
  const singleDoctor = JSON.parse(localStorage.getItem('doctor'));
  const doctors = JSON.parse(localStorage.getItem('doctors'));

  const user = JSON.parse(localStorage.getItem('user'));
  const { id: userId } = user;

  const handleDateChange = (value, dateString) => {
    console.log('Selected Time: ', value);
    setDate(dateString);
  };

  const handleDoctorChange = (event) => {
    const selectedDoctorId = event.target.value;
    setDoctorId(selectedDoctorId);
  };

  const handleReservationUpdate = async () => {
    try {
      setIsProcessing(true);
      const response = await axios.put(
        `http://localhost:3000/api/users/${userId}/doctors/${doctorId}/reservations/${reservation.id}`,
        {
          reservation: {
            user_id: userId,
            doctor_id: doctorId,
            date,
            details: 'Some details',
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const { data, status } = response;
      const { id } = data;
      if (status === 200) {
        toast.success('Reservation updated successfully!');
        setTimeout(() => {
          navigate(`/reservations/${doctorId}/${id}`);
        }, 2500);
      } else {
        throw new Error(data.message || 'Failed to update reservation');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update reservation');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div id="reserve-page" className="reservePage">
      <div className="container-fluid reservePage">
        <img
          src={`${singleDoctor?.picture}`}
          alt="Doctor"
          style={{ width: '100%', height: '100vh' }}
        />
        <div className="centered">
          <h1 className="doc-name pb-2">{`Dr ${singleDoctor?.name} - ${singleDoctor?.specialization}`}</h1>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minus
            provident et expedita perferendis dolore perspiciatis odio.
            Dignissimos, in deleniti pariatur alias odit explicabo vitae libero
            provident est placeat consectetur hic?
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <select
              style={{ width: '27%' }}
              id="doctor-select"
              value={doctorId}
              onChange={handleDoctorChange}
              className="rounded-0"
            >
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
            <DatePicker
              defaultValue={dayjs(reservation.date, 'YYYY-MM-DD')}
              format="YYYY-MM-DD"
              onChange={handleDateChange}
              className="date-picker rounded-0"
              disabledDate={(current) => current && current.valueOf() < moment().subtract(1, 'days')}
            />
          </div>

          <div className="d-flex gap-3 justify-content-center mt-4">
            <Link
              to={`/reservations/${reservation.doctorid}/${reservation.id}`}
              className="btn btn-outline-light pb-0"
            >
              Go Back
            </Link>
            {isProcessing ? (
              <button className="btn btn-outline-light" type="button" disabled>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="visually-hidden">Loading...</span>
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleReservationUpdate}
                className="btn btn-outline-light"
              >
                Update
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateReservation;
