import React, { useState, useEffect } from "react";
import InfoBox from "./InfoBox";
import Table from "./Table";
import Map from "./Map";
import {
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import "./App.css";

// https://disease.sh/v3/covid-19/countries

function App() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          setTableData(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryName = event.target.value;

    setSelectedCountry(countryName);

    const url =
      countryName === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryName}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setSelectedCountry(countryName);
        setCountryInfo(data);
      });
  };
  console.log("XXXXX:", countryInfo);
  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>COVID19 TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              value={selectedCountry}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app_stats">
          <InfoBox
            title="Coronovirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>
        <Map />
        {/* Map */}
      </div>

      <Card className="app_right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new Cases</h3>
          {/* Graph */}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
