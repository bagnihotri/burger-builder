import React, { useState, useEffect } from "react";
import Aux from "../../hoc/Aux/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-order";
const BurgerBuilder = () => {
  const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7,
  };
  const [ingredients, setIngredients] = useState({
    salad: 0,
    cheese: 0,
    bacon: 0,
    meat: 0,
  });
  const [total, setTotal] = useState(4);
  const [purchasble, setPurchasable] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const updatePurchasable = () => {
    const sum = Object.keys(ingredients)
      .map((igkey) => {
        return ingredients[igkey];
      })
      .reduce((acc, val) => {
        return acc + val;
      }, 0);
    sum > 0 ? setPurchasable(true) : setPurchasable(false);
  };
  useEffect(() => {
    updatePurchasable();
  }, [ingredients]);
  const addIngredientHandler = (type) => {
    const count = ingredients[type];
    const updatedCount = count + 1;
    const updatedIngredients = { ...ingredients };
    updatedIngredients[type] = updatedCount;
    setIngredients(updatedIngredients);
    const priceAddition = INGREDIENT_PRICES[type];
    const newPrice = total + priceAddition;
    setTotal(newPrice);
    updatePurchasable();
  };
  const removeIngredientHandler = (type) => {
    const count = ingredients[type];
    if (count <= 0) {
      return;
    }
    const updatedCount = count - 1;
    const updatedIngredients = { ...ingredients };
    updatedIngredients[type] = updatedCount;
    setIngredients(updatedIngredients);
    const priceAddition = INGREDIENT_PRICES[type];
    const newPrice = total - priceAddition;
    setTotal(newPrice);
    updatePurchasable();
  };
  const disabledKeyInfo = { ...ingredients };
  for (let key in disabledKeyInfo) {
    disabledKeyInfo[key] = disabledKeyInfo[key] <= 0;
  }
  const purchasingHandler = () => {
    setPurchasing(true);
  };
  const purchaseCancelHandler = () => {
    setPurchasing(false);
  };
  const purchaseContinueHandler = () => {
    //alert("you continue");
    axios.post("/orders.json");
  };
  return (
    <Aux>
      <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
        <OrderSummary
          ingredients={ingredients}
          purchaseCancelled={purchaseCancelHandler}
          purchaseContinue={purchaseContinueHandler}
          price={total}
        />
      </Modal>
      <Burger ingredients={ingredients} />
      <BuildControls
        ingredientAdded={addIngredientHandler}
        ingredientRemoved={removeIngredientHandler}
        disabled={disabledKeyInfo}
        price={total}
        purchasble={purchasble}
        ordered={purchasingHandler}
      />
    </Aux>
  );
};
export default BurgerBuilder;
