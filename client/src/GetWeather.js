import React, { useState, ReactDOM } from "react";
import './App.css';
import Axios from 'axios';
import { Cookies } from 'react-cookie';
import { Container, Row, Col, Button, Stack } from 'react-bootstrap';


function GetWeather() {

    const cookie = new Cookies();
    const [htmlTable, setTable] = useState("");
    const [forcastType, setForcastType] = useState("");

    const callGetWeather = () => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            Axios.get("https://api.weather.gov/points/" + latitude + "," + longitude, {
            }).then((apiResponse) => {
                Axios.get(apiResponse.data.properties.forecast, {
                }).then((forecastResponse) => {
                    var header = "<tr>";
                    var body = "<tr>";
                    var img = "<tr>";
                    var header2 = "<tr>";
                    var body2 = "<tr>";
                    var img2 = "<tr>";
                    if(!forecastResponse.data.properties.periods[0].isDaytime)
                    {
                        header += "<th class='tableheader'></th>";
                        body += "<td class='tablebody'></td>";
                        img += "<td class='tableimg'></td>"
                    }
                    forecastResponse.data.properties.periods.forEach(period => {
                        if(period.isDaytime)
                        {
                            header += ("<th class='tableheader'>" + period.name + "</th>");
                            var tempstring = period.temperature
                            if (forcastType == "C")
                            {
                                var temp = parseInt(tempstring);
                                var tempCalc = Math.round(((temp - 32) * .5556));
                                var tempstring = tempCalc.toString();
                            }
                            else if (forcastType == "K")
                            {
                                var temp = parseInt(tempstring);
                                var tempCalc = Math.round(((temp - 32) * .5556) + 273.15);
                                var tempstring = tempCalc.toString();
                            }
                            body += ("<td class='tablebody'>" + tempstring + " " + forcastType + "</td>");
                            img += ("<td class='tableimg'><img src=\"" + period.icon + "\"/></td>");
                        }
                        else
                        {
                            header2 += ("<th>" + period.name + "</th>");
                            var tempstring = period.temperature
                            if (forcastType == "C")
                            {
                                var temp = parseInt(tempstring);
                                var tempCalc = Math.round(((temp - 32) * .5556));
                                var tempstring = tempCalc.toString();
                            }
                            else if (forcastType == "K")
                            {
                                var temp = parseInt(tempstring);
                                var tempCalc = Math.round(((temp - 32) * .5556) + 273.15);
                                var tempstring = tempCalc.toString();
                            }
                            body2 += ("<td>" + tempstring + " " + forcastType + "</td>");
                            img2 += ("<td><img src=\"" + period.icon + "\"/></td>");

                        }
                    });
                    header += "</tr>";
                    body += "</tr>";
                    img += "</tr>";
                    header2 += "</tr>";
                    body2 += "</tr>";
                    img2 += "</tr>";

                    var html = "<table>" + header + body + img + "<tr class='spacer'></tr>" + header2 + body2 + img2 + "</table>";
                    setTable(html);
                });
            });
        });
    };

    const getUserPreference = () => {
        //Axios.post("https://api-dot-elite-firefly-337919.uc.r.appspot.com/getpreference", {
        Axios.post("http://localhost:8080/getpreference", {

            username: cookie.get("username")

        }).then((response) => {
            if (response.data.forcastType !== undefined) {
                setForcastType(response.data.forcastType);
            }
        })
    }

    const setUserPreference = (preference) => {
        setForcastType(preference);
        //Axios.post("https://api-dot-elite-firefly-337919.uc.r.appspot.com/setpreference", {
        Axios.post("http://localhost:8080/setpreference", {

            username: cookie.get("username"),
            forcastType: preference

        });
    }


    callGetWeather();
    getUserPreference();
    return (
        <div>
            <div dangerouslySetInnerHTML={{ __html: htmlTable }} />
            <Container>
                <Row>
                    <Col />
                    <Col>
                        <Stack direction="horizontal" className="col-md-5 mx-auto">
                            <Button onClick={() => setUserPreference("F")}>F</Button>
                            <Button onClick={() => setUserPreference("C")}>C</Button>
                            <Button onClick={() => setUserPreference("K")}>K</Button>
                        </Stack>
                    </Col>
                    <Col />
                </Row>
            </Container>
        </div>
    );
}

export default GetWeather;