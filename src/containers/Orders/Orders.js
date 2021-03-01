import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from '../../axios-orders';

import style from './Orders.module.css';

import Spinner from '../../components/UI/Spinner/Spinner';
import Order from '../../components/Order/Order';

const Orders = props => {
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        const queryParams = '?auth=' + props.token + '&orderBy="userId"&equalTo="' + props.userId + '"';
        axios.get('/order.json' + queryParams)
        .then(res => {
            const fetchedOrders = [];
            for(let key in res.data){
                fetchedOrders.push({
                    ...res.data[key],
                    id: key
                });
            }
            setLoading(false);
            setOrders(fetchedOrders);
            setError(false);
        })
        .catch(err => {
            setLoading(false);
            setError(true);
        });
    }, [])

    let ordersInstances = <Spinner />;
    if(!loading && error) {
        ordersInstances = <h3 className={style.Error}>Something went wrong! Try again later</h3>;
    }
    else if(!loading) {
        ordersInstances = orders.map(order => (
            <Order
                key={order.id}
                meals={order.meals}
                price={order.price}
            />
        ));
    }
    return (
        <div>
            {ordersInstances}
        </div>
    );
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        userId: state.auth.userId
    };
};

export default connect(mapStateToProps)(Orders);