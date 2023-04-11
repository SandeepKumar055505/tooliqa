import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  TextField,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: 600,
  },
  formControl: {
    margin: "20px 0px",
  },
  overRight: {
    display: "block",
    margin: " 20px 0",
    backgroundColor: "red",
  },
}));

function Calendar() {
  const classes = useStyles();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [country, setCountry] = useState("IN");
  const [holidays, setHolidays] = useState([]);
  const [options, setCountryOptions] = useState([]);
  const [error, setError] = useState({ month: "", year: "" });

  const fetchCountries = async () => {
    const response = await fetch(
      `https://calendarific.com/api/v2/countries?&api_key=a0154fb69f1632ad2c9e62c76fb65b0d3e7ded41`
    );
    const data = await response.json();
    setCountryOptions(
      data.response.countries.map((country) => ({
        value: country["iso-3166"],
        label: country.country_name,
      }))
    );
  };

  useEffect(() => {
    fetchHolidays();
    fetchCountries();
  },[]);

  const fetchHolidays = async (button) => {
    const response = await fetch(
      `https://calendarific.com/api/v2/holidays?&api_key=a0154fb69f1632ad2c9e62c76fb65b0d3e7ded41&country=${country}&year=${year}&month=${month}`
    );
    const data = await response.json();

    setHolidays(data.response.holidays);
    if (button == "button") {
      let arrLen = holidays.length;

      if (arrLen == 0) {
        setHolidays(data.response.holidays);
      }
    }
  };

  const handleYearChange = (e) => {
    let year = e.target.value;
    if (year.length == 4) {
      setError({ year: "" });
    } else {
      setError({ year: "please provide valid year like to 2023" });
    }
    setYear(e.target.value);
    setHolidays([]);
  };

  const handleMonthChange = (e) => {
    let month = e.target.value;
    if (month <= 0 || month > 12) {
      setError({ month: "please provide valid month like to 1 to 12" });
    } else {
      setError({ month: "" });
    }
    setMonth(e.target.value);
    setHolidays([]);
  };

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
    setHolidays([]);
  };

  useEffect(() => {
    holidays.map((data) => {});
  }, [handleCountryChange]);


  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Public Holidays Calendar
      </Typography>
      <div
        elevation={3}
        sx={{ padding: 7 }}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <FormControl>
          <select
            onChange={handleCountryChange}
            style={{
              fontSize: "20px",
              fontWeight: "300px",
              padding: "10px 0px 10px 10px",
              borderRadius: 10,
            }}
          >
            <option value={country}>Select a country</option>
            {options.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
        </FormControl>
        <FormControl
          style={{
            margin: "20px 0px",
            backgroundColor: "white",
            borderRadius: 10,
          }}
        >
          <TextField
            label="Year"
            type="number"
            value={year}
            onChange={handleYearChange}
          />
        </FormControl>
        {error && error.year && error.year.length > 0 ? (
          <p
            style={{
              backgroundColor: "red",
              color: "white",
              padding: 5,
              borderRadius: 50,
            }}
          >
            {error.year}
          </p>
        ) : null}

        <FormControl
          style={{
            margin: "20px 0px",
            backgroundColor: "white",
            borderRadius: 10,
          }}
        >
          <TextField
            label="Month"
            type="number"
            value={month}
            onChange={handleMonthChange}
          />
        </FormControl>
        {error && error.month && error.month.length > 0 ? (
          <p
            style={{
              backgroundColor: "red",
              color: "white",
              padding: 5,
              borderRadius: 50,
            }}
          >
            {error.month}
          </p>
        ) : null}
        <FormControl style={{ margin: "20px 0px" }}>
          <Button
            onClick={() => fetchHolidays("button")}
            style={{
              backgroundColor: "green",
              color: "white",
              borderRadius: 50,
            }}
          >
            Check Holiday
          </Button>
        </FormControl>
      </div>
      <TableContainer component={Paper} className={classes.table}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Reason</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {holidays.map((holiday) => (
              <TableRow key={holiday.date.iso}>
                <TableCell>{holiday.date.iso}</TableCell>
                <TableCell>{holiday.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Calendar;
