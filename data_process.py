import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.feature_selection import VarianceThreshold
from imblearn.over_sampling import SMOTE
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dropout
from tensorflow.keras.layers import Dense
from sklearn.metrics import accuracy_score
from sklearn.metrics import confusion_matrix
from sklearn.metrics import classification_report

# Đọc dữ liệu từ file CSV
df = pd.read_csv('train.csv')

# Tách X và y để tiền xử lý dữ liệu
X = df.drop(['status'], axis=1)
y = df['status']

#Chuyển đổi dữ liệu với kỹ thuật EncoderLabel
# Kiểm tra tên của các cột
names = list(df.columns)
# Kiểm tra loại của các cột
types = df.dtypes
# Kết hợp tất cả dữ liệu với nhau theo một định dạng thống nhất
from sklearn.preprocessing import LabelEncoder
le = LabelEncoder()
for i in range(len(types)):
    if types[i]=='object':
        le.fit_transform(df[names[i]])
        df[names[i]] = le.transform(df[names[i]])

# Áp dụng SMOTE để cân bằng dữ liệu
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X, y)

# Tách tập train và test
X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.3, random_state=42)

# Chuẩn hóa dữ liệu StandardScaler
# Khởi tạo StandardScaler
scaler = StandardScaler()
# Fit vào dữ liệu và biến đổi dữ liệu
#standardize data
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Điền giá trị trung bình cho các cột thiếu
imputer = SimpleImputer(strategy='mean')
df_imputed = pd.DataFrame(imputer.fit_transform(X), columns=df.columns[:-1])

# Kết hợp cột status vào DataFrame cuối cùng
# Rút trích các tên đặc trưng thành mảng
#feature = df.drop(['status'],axis=1).columns
#y_resampled = pd.Series(y_resampled, name='status')
#X_new = pd.DataFrame(X, columns=feature)
#df_final = pd.concat([X_new, y_resampled], axis=1)

# Tính số lượng mẫu trong mỗi lớp
#class_counts = df['status'].value_counts()

# In số lượng mẫu trong mỗi lớp
#print("Số lượng mẫu trong mỗi lớp:")
#print(class_counts)

# Kiểm tra cân bằng dữ liệu
#if class_counts.min() / class_counts.max() < 0.5:
 #   print("Dữ liệu không cân bằng")
#else:
 #   print("Dữ liệu cân bằng")


# Lưu dữ liệu đã xử lý vào file CSV
#df_final.to_csv('processed_train.csv', index=False)

#Khởi tạo mô hiinhf ffnn
ffnn = Sequential()
ffnn.add(Dense(70, input_shape=(62,), activation='relu'))
ffnn.add(Dense(50, activation='relu'))
ffnn.add(Dense(1, activation='sigmoid'))
ffnn.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])

# Huấn luyện mô hình ffnn
ffnn.fit(X_train, y_train, epochs=5, batch_size=10, validation_split=0.2)
# Đánh giá mô hình trên tập test
test_loss, test_acc = ffnn.evaluate(X_test, y_test)

y_pred = ffnn.predict(X_test)
y_pred = (y_pred > 0.5).astype(int)

accuracy = accuracy_score(y_test, y_pred)
print("Accuracy: %.2f%%" % (accuracy * 100.0))
print(classification_report(y_test,y_pred))

import json

# Tạo một dictionary chứa các thông số của mô hình
model_params = {
    'layers': [
        {'type': 'Dense', 'units': 70, 'activation': 'relu'},
        {'type': 'Dense', 'units': 50, 'activation': 'relu'},
        {'type': 'Dense', 'units': 1, 'activation': 'sigmoid'}
    ],
    'loss': 'binary_crossentropy',
    'optimizer': 'adam',
    'metrics': ['accuracy']
}

# Lưu các thông số vào tệp JSON
with open('ffnn_model.json', 'w') as json_file:
    json.dump(model_params, json_file)