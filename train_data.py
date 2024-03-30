import pandas as pd

def analyze_url(urls):
    try:
        url_obj = pd.DataFrame({
            'length_url': urls.str.len(),
            # Độ dài của URL
            'length_hostname': urls.apply(lambda x: len(x.split('/')[2]) if len(x.split('/')) >= 3 else 0),
            # Độ dài của tên máy chủ (hostname) trong URL. Nó được tính bằng cách tách chuỗi URL bằng dấu '/' và lấy độ dài của phần tử thứ ba (index 2) nếu có.
            'ip': urls.apply(lambda x: 1 if x.split('/')[2].replace('.', '').isdigit() else 0 if len(x.split('/')) >= 3 else None),
            # Xác định xem URL có phải là địa chỉ IP hay không. Nếu phần tử thứ ba sau khi tách chuỗi URL bằng dấu '/' là một địa chỉ IP (chỉ chứa các số và dấu chấm), thì được gán giá trị 1, ngược lại là 0.
            'nb_dots': urls.str.count('\.'),
            # Số lượng dấu chấm trong URL
            'nb_hyphens': urls.str.count('\-'),
            # Số lượng dấu gạch ngang trong URL
            'nb_at': urls.str.count('\@'),
            # Số lượng ký tự '@' trong URL
            'nb_qm': urls.str.count('\?'),
            # Số lượng ký tự '?' trong URL
            'nb_and': urls.str.count('\&'),
            # Số lượng ký tự '&' trong URL
            'nb_or': urls.str.count('\|'),
            # Số lượng ký tự '|' trong URL
            'nb_eq': urls.str.count('\='),
            # Số lượng ký tự '=' trong URL
            'nb_underscore': urls.str.count('_'),
            # Số lượng ký tự '_' trong URL
            'nb_tilde': urls.str.count('~'),
            # Số lượng ký tự '~' trong URL
            'nb_percent': urls.str.count('%'),
            # Số lượng ký tự '%' trong URL
            'nb_slash': urls.str.count('/'),
            # Số lượng dấu gạch chéo trong URL
            'nb_star': urls.str.count(r'\*'),  # Sử dụng r'' để biểu thức chính quy không bị xử lý nội suy
            # Số lượng ký tự '*' trong URL
            'nb_colon': urls.str.count(':'),
            # Số lượng dấu hai chấm trong URL
            'nb_comma': urls.str.count(','),
            # Số lượng dấu phẩy trong URL
            'nb_semicolon': urls.str.count(';'),
            # Số lượng dấu chấm phẩy trong URL
            'nb_dollar': urls.str.count('$'),
            # Số lượng ký tự '$' trong URL
            'nb_space': urls.str.count(' '),
            # Số lượng dấu cách trong URL
            'nb_www': urls.str.contains('www').astype(int),
            # Có chứa 'www' trong URL không
            'nb_com': urls.str.contains('.com').astype(int),
            # Có chứa '.com' trong URL không
            'nb_dslash': urls.str.contains('//').astype(int),
            # Có chứa hai dấu gạch chéo liền nhau trong URL không
            'http_in_path': urls.str.contains('http').astype(int),
            # 'http' xuất hiện trong đường dẫn của URL không
            'https_token': urls.str.contains('https').astype(int),
            # 'https' xuất hiện trong URL không58
            'ratio_digits_url': urls.apply(lambda x: sum(c.isdigit() for c in x) / len(x)),
            # Tỷ lệ số chữ số trong URL, được tính bằng cách chia tổng số chữ số trong URL cho độ dài của URL.
            'ratio_digits_host': urls.apply(lambda x: sum(c.isdigit() for c in x.split('/')[2]) / len(x.split('/')[2]) if len(x.split('/')) >= 3 else 0),
            # Tỷ lệ số chữ số trong phần tên máy chủ của URL, được tính bằng cách chia tổng số chữ số trong phần tên máy chủ cho độ dài của phần tên máy chủ, nếu có.
            'punycode': urls.apply(lambda x: 1 if 'xn--' in x else 0),
            # URL có sử dụng mã hóa Punycode hay không
            'port': urls.apply(lambda x: x.split('/')[2].split(':')[1] if len(x.split('/')) >= 3 and ':' in x.split('/')[2] else 0),
            # Số cổng trong URL (nếu có)
            'tld_in_path': urls.apply(lambda x: 1 if '.com/' in x or '.net/' in x or '.org/' in x else 0),
            # Tên miền cấp cao nhất (TLD) xuất hiện trong đường dẫn của URL không
            'tld_in_subdomain': urls.apply(lambda x: 1 if '.com.' in x or '.net.' in x or '.org.' in x else 0),
            # Tên miền cấp cao nhất (TLD) xuất hiện trong phần con-domain của URL không
            'abnormal_subdomain': urls.apply(lambda x: 1 if len(x.split('/')[2].split('.')) > 3 else 0),
            # Phần con-domain của URL có chứa nhiều hơn 3 phần không (phần tên máy chủ bình thường, tên miền cấp cao nhất, và tên miền cấp cao nhất thứ hai) không
            'nb_subdomains': urls.apply(lambda x: len(x.split('/')[2].split('.')) - 2 if len(x.split('/')) >= 3 else 0),
            # Số lượng phần con-domain trong URL (trừ phần tên miền cấp cao nhất và tên miền cấp cao nhất thứ hai)
            'prefix_suffix': urls.apply(lambda x: 1 if 'www.' in x else 0),
            # Tên miền phổ biến có xuất hiện trong phần đuôi của URL không
            'suspicious_tld': urls.apply(lambda x: 1 if any(subdomain.endswith(tld) for subdomain in x.split('/')[2].split('.')[:-1] if len(subdomain) > 0 for tld in ['info', 'ooo', 'xyz', 'pw', 'top']) else 0),
            # Tên miền kết thúc bằng các phần mở rộng đáng ngờ như 'info', 'ooo', 'xyz', 'pw', 'top' không
            'statistical_report': urls.apply(lambda x: 1 if 'click' in x or 'report' in x or 'stat' in x else 0),
            # Có xuất hiện các từ khóa thống kê như 'click', 'report', 'stat' trong URL không
            'nb_hyperlinks': urls.str.count('<a href'),
            # Số lượng siêu liên kết ('<a href') trong HTML
            'nb_extCSS': urls.str.count('<link rel="stylesheet"'),
            # Số lượng tệp CSS bên ngoài được liên kết trong HTML
            'ratio_intRedirection': urls.str.contains('http://').sum() / urls.str.count('\/\/'),
            # Tỷ lệ chuyển hướng nội bộ (bắt đầu bằng 'http://') so với tổng số chuyển hướng
            'ratio_extRedirection': urls.str.contains('http://').sum() / urls.str.count('\/\/'),
            # Tỷ lệ chuyển hướng ngoại (bắt đầu bằng 'http://') so với tổng số chuyển hướng
            'ratio_intErrors': urls.str.contains('http://').sum() / urls.str.count('\/\/'),
            # Tỷ lệ lỗi nội bộ (bắt đầu bằng 'http://') so với tổng số lỗi
            'ratio_extErrors': urls.str.contains('http://').sum() / urls.str.count('\/\/'),
            # Tỷ lệ lỗi ngoại (bắt đầu bằng 'http://') so với tổng số lỗi
            'login_form': urls.str.contains('<form action="login"').astype(int),
            # Có biểu mẫu đăng nhập trong HTML không
            'external_favicon': urls.str.contains('<link rel="icon"').astype(int),
            # Có biểu tượng trang web bên ngoài trong HTML không
            'links_in_tags': urls.str.contains('<script src').astype(int),
            # Có liên kết trong thẻ script trong HTML không
            'submit_email': urls.str.contains('mailto:').astype(int),
            # Có một mẫu email trong HTML không
            'sfh': urls.str.contains('<form action=""').astype(int),
            # Có một trường ẩn chứa một URL không
            'iframe': urls.str.contains('<iframe').astype(int),
            # Có một thẻ iframe trong HTML không
            'popup_window': urls.str.contains('window.open').astype(int),
            # Có một cửa sổ popup được mở bằng JavaScript không
            'safe_anchor': urls.str.contains('window.open').astype(int),
            # Có một liên kết an toàn trong HTML không
            'onmouseover': urls.str.contains('onmouseover').astype(int),
            # Có sự kiện onmouseover trong HTML không
            'right_click': urls.str.contains('right-click').astype(int),
            # Có sự kiện click phải chuột trong HTML không
            'empty_title': urls.str.contains('<title></title>').astype(int),
            # Có một thẻ title rỗng trong HTML không
            'domain_in_title': urls.apply(lambda x: 1 if '<title>' in x and '</title>' in x else 0),
            # Tên miền xuất hiện trong thẻ title của HTML không
            'domain_with_copyright': urls.str.contains('©').astype(int),
            # Tên miền chứa ký tự
             # Bản quyền trong HTML không
            'whois_registered_domain': urls.apply(lambda x: 1 if 'Domain Name:' in x else 0),
            # Tên miền đã đăng ký xuất hiện trong thông tin WHOIS không
            'domain_registration_length': urls.apply(lambda x: 1 if 'Registration Length:' in x else 0),
            # Chiều dài đăng ký tên miền trong thông tin WHOIS không
            'domain_age': urls.apply(lambda x: 1 if 'Domain Age:' in x else 0),
            # Tuổi tên miền trong thông tin WHOIS không
            'web_traffic': urls.apply(lambda x: 1 if 'http://' in x or 'https://' in x else 0),
            # Xác định xem URL có chứa 'http://' hoặc 'https://' hay không. Nếu có, được gán giá trị 1, ngược lại là 0.
            'dns_record': urls.apply(lambda x: 1 if 'http://' in x or 'https://' in x else 0),
            # Tương tự như 'web_traffic', xác định xem URL có chứa 'http://' hoặc 'https://' hay không.
            'google_index': urls.apply(lambda x: 1 if 'http://' in x or 'https://' in x else 0),
            # Xác định xem URL có được Google index không
            'page_rank': urls.apply(lambda x: 1 if 'http://' in x or 'https://' in x else 0),
            # Xác định xem URL có được Google page rank không
        })

        # Chuyển các cột sang dạng số nếu có thể
        url_obj = url_obj.apply(pd.to_numeric, errors='ignore')
        return url_obj
    except Exception as e:
        print("Error analyzing URL:", e)
        return None

# Đọc dữ liệu từ file CSV
try:
    df = pd.read_csv('./dataset_phishing.csv')
except FileNotFoundError:
    print("File 'dataset_phishing.csv' not found.")



# Phân tích các URL và tạo DataFrame chứa các feature
train_data = analyze_url(df['url'])

# Kiểm tra xem train_data có là None không
if train_data is not None:
    # Thêm cột 'status' vào DataFrame train_data và chuyển giá trị 'legitimate' thành 0, 'phishing' thành 1
    train_data['status'] = df['status'].apply(lambda x: 0 if x == 'legitimate' else 1)

    # Xuất file train.csv
    train_data.to_csv('train.csv', index=False)

    print("Đã train thành công file train.csv")

    # Kiểm tra dữ liệu sau khi tạo
    print(train_data.head())
else:
    print("Có lỗi xảy ra trong quá trình phân tích URL.")