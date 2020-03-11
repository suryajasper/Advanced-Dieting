class Food {
  constructor(name) {
    this.name = name;
    this.cal = 0;
    this.cholesterol = 0;
    this.dietaryfiber = 0;
    this.potassium = 0;
    this.protein = 0;
    this.satFat = 0;
    this.sodium = 0;
    this.sugar = 0;
    this.carb = 0;
    this.fat = 0;
    this.img = null;
    this.servingQty = 0;
    this.foodGroup = null;
    this.date = null;
  }
  setFoodGroup(group) {
    this.foodGroup = group;
  }
  setCalories(val) {
    this.cal = val;
  }
  setCholesterol(val) {
    this.cholesterol = val;
  }
  setDietaryFiber(val) {
    this.dietaryfiber = val;
  }
  setPotassium(val) {
    this.potassium = val;
  }
  setProtein(val) {
    this.protein = val;
  }
  setSatFat(val) {
    this.satFat = val;
  }
  setSodium(val) {
    this.sodium = val;
  }
  setSugar(val) {
    this.sugar = val;
  }
  setCarb(val) {
    this.carb = val;
  }
  setFat(val) {
    this.fat = val;
  }
  setImage(val) {
    this.img = val;
  }
  setServingQuantity(val) {
    this.servingQty = val;
  }
  setDate(val) {
    this.date = val;
  }
}
