import React from 'react';
import { Redirect } from 'react-router-dom';

import * as actions from '../../store/actions/index';

import { connect } from 'react-redux';
import MealsList from '../../components/MealsList/MealsList';
import ContactData from './ContactData/ContactData';

const Checkout = props => {
    let mealsSummary = <Redirect to="/" />;
    let purchasedRedirect = null;
    if(props.meals && Object.keys(props.orderedMeals).length) {
        purchasedRedirect = props.purchased ? <Redirect to="/" /> : null;
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
        <React.Fragment>
            {purchasedRedirect}
            {mealsSummary}
            <ContactData />
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    return {
        meals: state.orderBuilder.meals,
        orderedMeals: state.orderBuilder.orderedMeals,
        totalPrice: state.orderBuilder.totalPrice,
        purchased: state.orderSender.purchased
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onMealAdded: (mealName) => dispatch(actions.addMeal(mealName)),
        onMealRemoved: (mealName) => dispatch(actions.removeMeal(mealName))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);