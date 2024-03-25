import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.feature_selection import VarianceThreshold
from imblearn.over_sampling import SMOTE

# Đọc dữ liệu từ file CSV
df = pd.read_csv('train.csv')

# Tách X và y để tiền xử lý dữ liệu
X = df.drop(['status'], axis=1)
y = df['status']

# Áp dụng SMOTE để cân bằng dữ liệu
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X, y)

# Chuẩn hóa dữ liệu StandardScaler
# Khởi tạo StandardScaler
scaler = StandardScaler()
# Fit vào dữ liệu và biến đổi dữ liệu
X = scaler.fit_transform(X_resampled)

# Điền giá trị trung bình cho các cột thiếu
imputer = SimpleImputer(strategy='mean')
df_imputed = pd.DataFrame(imputer.fit_transform(X), columns=df.columns[:-1])

# Kết hợp cột status vào DataFrame cuối cùng
# Rút trích các tên đặc trưng thành mảng
feature = df.drop(['status'],axis=1).columns
y_resampled = pd.Series(y_resampled, name='status')
X_new = pd.DataFrame(X, columns=feature)
df_final = pd.concat([X_new, y_resampled], axis=1)

# Tính số lượng mẫu trong mỗi lớp
class_counts = df['status'].value_counts()

# In số lượng mẫu trong mỗi lớp
print("Số lượng mẫu trong mỗi lớp:")
print(class_counts)

# Kiểm tra cân bằng dữ liệu
if class_counts.min() / class_counts.max() < 0.5:
    print("Dữ liệu không cân bằng")
else:
    print("Dữ liệu cân bằng")

# Lưu dữ liệu đã xử lý vào file CSV
df_final.to_csv('processed_train.csv', index=False)

