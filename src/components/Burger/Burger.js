import React from 'react';
import styles from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = props => {
  let transformedIngredients;
  if (props.ingredients) {
    transformedIngredients = Object.keys(props.ingredients)
      .map(ingredientKey => {
        return [...Array(props.ingredients[ingredientKey])].map((_, i) => {
          return <BurgerIngredient key={ingredientKey + i} type={ingredientKey} />;
        });
      })
      .reduce((arr, el) => {
        return arr.concat(el);
      }, []);
    if (transformedIngredients.length === 0) {
      transformedIngredients = <p>Please start adding ingredients</p>;
    }
  }
  return (
    <div className={styles.Burger}>
      <BurgerIngredient type="bread-top"></BurgerIngredient>
      {props.ingredients ? transformedIngredients : null}
      <BurgerIngredient type="bread-bottom"></BurgerIngredient>
    </div>
  );
};

export default burger;
