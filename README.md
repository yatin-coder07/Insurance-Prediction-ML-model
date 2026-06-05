# Medical Insurance Charges Prediction

This is my first Machine Learning project where I performed data preprocessing, exploratory data analysis, and regression model training on a medical insurance dataset.

## Project Objective

The objective of this project is to predict medical insurance charges based on user details such as age, sex, BMI, number of children, smoking status, and region.

## Dataset

The dataset contains 1338 records and 7 columns:

- age
- sex
- bmi
- children
- smoker
- region
- charges

The target column is `charges`.

## Steps Performed

1. Loaded the dataset using Pandas
2. Checked dataset information using `df.info()`
3. Checked statistical summary using `df.describe()`
4. Checked and removed duplicate records
5. Performed exploratory data analysis using:
   - Histograms
   - Boxplots
   - Countplots
   - Correlation heatmap
6. Encoded categorical variables using one-hot encoding
7. Scaled numerical features using StandardScaler
8. Split the data into training and testing sets
9. Trained regression models:
   - Linear Regression
   - Random Forest Regressor
10. Evaluated the models using:
   - MAE
   - RMSE
   - R2 Score

## Key Insights

- Insurance charges are right-skewed.
- Age has a positive correlation with insurance charges.
- BMI has a weak positive correlation with charges.
- Number of children has very weak correlation with charges.
- Smoking status is expected to be one of the strongest factors affecting insurance charges.

## Technologies Used

- Python
- Pandas
- NumPy
- Matplotlib
- Seaborn
- Scikit-learn
- Jupyter Notebook

## Machine Learning Task

This is a regression problem because the target variable, `charges`, is a continuous numerical value.

## Conclusion

This project helped me understand the complete beginner ML workflow, including data cleaning, visualization, preprocessing, model training, and evaluation.