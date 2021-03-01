import React, { useEffect } from 'react';
import style from './OrderBuilder.module.css';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../store/actions/index';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import MealsList from '../../components/MealsList/MealsList';

const OrderBuilder = props => {
    useEffect(() => {
        if(!props.meals){
            props.onInitMeals();
        }
    }, []);

    const purchaseHandler = () => {
        if (props.isAuth) {
            props.history.push('/checkout');
        } else {
            props.onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }
    }

    let mealsList = props.error ? <p>Meals can't be loaded</p> : <Spinner />;
    if(props.meals) {
        mealsList = <MealsList 
            menuPart={props.menuPart}
            meals={props.meals}
            mealAdded={props.onMealAdded}
            mealRemoved={props.onMealRemoved}
            summary={false}
        />;
    }
    let mealsSummary = null;
    if(props.meals) {
        mealsSummary = (
        <MealsList 
            meals={props.meals}
            mealAdded={props.onMealAdded}
            mealRemoved={props.onMealRemoved}
            summary={true}
            totalPrice={props.totalPrice}
        />
        );
    }
    return (
        <div className={style.OrderBuilder}>
            {mealsList}
            {mealsSummary}
            <Button
                btnType="Success"
                disabled={Object.keys(props.orderedMeals).length ? false : true}
                clicked={purchaseHandler} 
            >{props.isAuth ? 'ORDER NOW' : 'LOGIN TO ORDER'}</Button>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        meals: state.orderBuilder.meals,
        totalPrice: state.orderBuilder.totalPrice,
        error: state.orderBuilder.error,
        purchased: state.orderSender.purchased,
        isAuth: state.auth.token !== null,
        orderedMeals: state.orderBuilder.orderedMeals
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onInitMeals: () => dispatch(actions.initMeals()),
        onMealAdded: (mealName) => dispatch(actions.addMeal(mealName)),
        onMealRemoved: (mealName) => dispatch(actions.removeMeal(mealName)),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OrderBuilder));