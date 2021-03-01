import React, { useState, useEffect } from 'react';

import style from './ContactData.module.css'
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';

import { checkValidity } from '../../../shared/validation';
import Input from '../../../components/UI/Input/Input';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';

const ContactData = props => {
    const [orderForm, setOrderForm] = useState({
        name: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Your Name'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        address: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Address'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        phoneNumber: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Your Phone Number'
            },
            value: '',
            validation: {
                required: true,
                minLength: 7,
                maxLength: 9,
                isNumeric: true
            },
            valid: false,
            touched: false
        },
        paymentMethod: {
            elementType: 'select',
            elementConfig: {
                options: [
                    {value: 'cash', displayValue: 'Cash'},
                    {value: 'card', displayValue: 'Card'}
                ]
            },
            value: 'cash',
            validation: {},
            valid: true
        }
    });
    const [formIsValid, setFormIsValid] = useState(false);
    useEffect(() => {
        return () => {
            props.ErrorReset();
        };
    }, []);

    const inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...orderForm
        }
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        }
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;

        let formIsValid = true;
        for(let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }

        setOrderForm(updatedOrderForm);
        setFormIsValid(formIsValid);
    }

    const orderHandler = (event) => {
        event.preventDefault();

        const formData = {}
        for(let formElementIdentfier in orderForm) {
            formData[formElementIdentfier] = orderForm[formElementIdentfier].value;
        }
        const order = {
            meals: props.orderedMeals,
            price: props.price,
            orderData: formData,
            userId: props.userId
        }
        props.onOrderMeals(order, props.token);
    }

    const formElementsArray = [];
    for (let key in orderForm)
    {
        formElementsArray.push({
            id: key,
            config: orderForm[key]
        })
    }

    let form = (
        <form onSubmit={orderHandler}>
            {formElementsArray.map(formElement => (
                <Input
                    key={formElement.id}
                    elementType={formElement.config.elementType}
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.config.value}
                    invalid={!formElement.config.valid}
                    shouldValidate={formElement.config.validation}
                    touched={formElement.config.touched}
                    changed={(event) => inputChangedHandler(event, formElement.id)}
                />
            ))}
            <Button 
                btnType="Success"
                disabled={!formIsValid}    
            >ORDER</Button>
        </form>
    );
    if (props.loading) {
        form = <Spinner />;
    }

    return (
        <div className={style.ContactData}>
            {props.error ? <h3 style={{color: "red"}}>Something went wrong! Try again later</h3> : null}
            <h4>Enter your delivery data</h4>
            {form}
        </div>
    );
}

const mapStateToProps = state => {
    return {
        meals: state.orderBuilder.meals,
        price: state.orderBuilder.totalPrice,
        orderedMeals: state.orderBuilder.orderedMeals,
        loading: state.orderSender.loading,
        token: state.auth.token,
        userId: state.auth.userId,
        error: state.orderSender.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderMeals: (orderData, token) => dispatch(actions.purchaseOrder(orderData, token)),
        ErrorReset: () => dispatch(actions.errorPurchasedReset())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactData);