/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect,useState } from 'react';
import Container from 'react-bootstrap/Container';
import './CommentsPieChart.css';
import CookieService from '../../../../services/CookieService';
import apiClient from '../../../../services/apiClient'
import constants from '../../../../assets/constants';
import { useNavigate } from "react-router-dom";
import Loader from '../../../utils/Loader/Loader';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import { ResponsivePie } from '@nivo/pie'

const CommentsPieChart = () => {
    const navigate = useNavigate();

    const [loading,setLoading] = useState(false)

    const [data,setData] = useState(null);
    
    useEffect(()=>{
        getData()
    },[])

    const getData = async () => {
        setLoading(true);

        const token = CookieService.get('token')
        apiClient.get(`/dashboards/bannedratings?`,{headers:{'token':token?JSON.parse(token):''}})
        .then(async (result)=>{
            console.log('getData bannedratings result',result)
            const chartData = []
            chartData.push({
                id: "Activos",
                label: "Activos",
                value: result.active,
            })
            chartData.push({
                id: "Inactivos",
                label: "Inactivos",
                value: result.inactive,
            })
            setData(chartData)
            setLoading(false);
        })
        .catch(function (error) {
            setLoading(false);
            console.log('searchTours err',error);
            if(error?.response?.status===401) {
                navigate(constants.ROUTES.HOME)
                window.location.reload(false);
            }
        })
    }

    return (
        <Container>
            {loading&&<Loader></Loader>}
            <Card>
                <Card.Title style={{backgroundColor:'#4E598C',color:'white',paddingLeft:12}}>
                    Top 10 Paseos Valorados
                </Card.Title>
                <Card.Body>
                    <Row style={{height:'300px'}}>
                        {
                            data&&
                            <ResponsivePie
                            data={data}
                            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                            innerRadius={0.5}
                            padAngle={0.7}
                            cornerRadius={3}
                            activeOuterRadiusOffset={8}
                            borderWidth={1}
                            borderColor={{
                                from: 'color',
                                modifiers: [
                                    [
                                        'darker',
                                        0.2
                                    ]
                                ]
                            }}
                            arcLinkLabelsSkipAngle={10}
                            arcLinkLabelsTextColor="#333333"
                            arcLinkLabelsThickness={2}
                            arcLinkLabelsColor={{ from: 'color' }}
                            arcLabelsSkipAngle={10}
                            arcLabelsTextColor={{
                                from: 'color',
                                modifiers: [
                                    [
                                        'darker',
                                        2
                                    ]
                                ]
                            }}
                            legends={[
                                {
                                    anchor: 'bottom',
                                    direction: 'row',
                                    justify: false,
                                    translateX: 0,
                                    translateY: 56,
                                    itemsSpacing: 0,
                                    itemWidth: 100,
                                    itemHeight: 18,
                                    itemTextColor: '#999',
                                    itemDirection: 'left-to-right',
                                    itemOpacity: 1,
                                    symbolSize: 18,
                                    symbolShape: 'circle',
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemTextColor: '#000'
                                            }
                                        }
                                    ]
                                }
                            ]}
                        />
                        }
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default CommentsPieChart;
