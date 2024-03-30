
// Xử lý sự kiện khi DOM đã được load hoàn tất
document.addEventListener('DOMContentLoaded', function() {
  // Sử dụng chrome.tabs API để lấy thông tin về tab hiện tại
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // Lấy URL của trang web hiện tại từ thông tin về tab
      var currentUrl = tabs[0].url;
      
      // Gán URL vào thẻ input
      document.getElementById('urlInput').value = currentUrl;

      // Xử lý sự kiện khi nút "Check Phishing" được nhấp vào
      document.getElementById('checkButton').addEventListener('click', function() {
          // Lấy URL từ input
          var url = document.getElementById('urlInput').value;
          // Kiểm tra xem URL có tồn tại không
          if (url) {
              // Gọi hàm dự đoán với URL nhận được
              main(url);
              // console.log(final);
              // alert(result);

          } else {
              alert("Vui lòng nhập url để kiểm tra.");
          }
      });
  });
});

async function loadModel() {
    try {
        const model = await tf.loadLayersModel('ffnn_model.json');
        console.log('Model loaded successfully.');
        return model;
    } catch (error) {
        console.error('Error loading model:', error);
        throw error; 
    }
}

// Hàm dự đoán URL bằng mô hình FFNN đã tải
async function predict(url, model) {
    try {
        // Tính toán các đặc trưng của URL và tạo tensor từ chúng
        const features = {
            'length_url': url.length,
            // Độ dài của URL
            'length_hostname': url.split('/')[2].length,
            // Độ dài của tên máy chủ (hostname) trong URL. Nó được tính bằng cách tách chuỗi URL bằng dấu '/' và lấy độ dài của phần tử thứ ba (index 2).
            'ip': url.split('/')[2].replace('.', '').match(/^\d+$/) !== null ? 1 : 0,
            // Xác định xem URL có phải là địa chỉ IP hay không. Nếu phần tử thứ ba sau khi tách chuỗi URL bằng dấu '/' là một địa chỉ IP (chỉ chứa các số và dấu chấm), thì được gán giá trị 1, ngược lại là 0.
            'nb_dots': url.split('.').length - 1,
            // Số lượng dấu chấm trong URL
            'nb_hyphens': url.split('-').length - 1,
            // Số lượng dấu gạch ngang trong URL
            'nb_at': url.split('@').length - 1,
            // Số lượng ký tự '@' trong URL
            'nb_qm': url.split('?').length - 1,
            // Số lượng ký tự '?' trong URL
            'nb_and': url.split('&').length - 1,
            // Số lượng ký tự '&' trong URL
            'nb_or': url.split('|').length - 1,
            // Số lượng ký tự '|' trong URL
            'nb_eq': url.split('=').length - 1,
            // Số lượng ký tự '=' trong URL
            'nb_underscore': url.split('_').length - 1,
            // Số lượng ký tự '_' trong URL
            'nb_tilde': url.split('~').length - 1,
            // Số lượng ký tự '~' trong URL
            'nb_percent': url.split('%').length - 1,
            // Số lượng ký tự '%' trong URL
            'nb_slash': url.split('/').length - 1,
            // Số lượng dấu gạch chéo trong URL
            'nb_star': url.split('*').length - 1,
            // Số lượng ký tự '*' trong URL
            'nb_colon': url.split(':').length - 1,
            // Số lượng dấu hai chấm trong URL
            'nb_comma': url.split(',').length - 1,
            // Số lượng dấu phẩy trong URL
            'nb_semicolon': url.split(';').length - 1,
            // Số lượng dấu chấm phẩy trong URL
            'nb_dollar': url.split('$').length - 1,
            // Số lượng ký tự '$' trong URL
            'nb_space': url.split(' ').length - 1,
            // Số lượng dấu cách trong URL
            'nb_www': url.includes('www') ? 1 : 0,
            // Có chứa 'www' trong URL không
            'nb_com': url.includes('.com') ? 1 : 0,
            // Có chứa '.com' trong URL không
            'nb_dslash': url.includes('//') ? 1 : 0,
            // Có chứa hai dấu gạch chéo liền nhau trong URL không
            'http_in_path': url.includes('http') ? 1 : 0,
            // 'http' xuất hiện trong đường dẫn của URL không
            'https_token': url.includes('https') ? 1 : 0,
            // 'https' xuất hiện trong URL không
            'ratio_digits_url': url.replace(/\D/g, '').length / url.length,
            // Tỷ lệ số chữ số trong URL, được tính bằng cách chia tổng số chữ số trong URL cho độ dài của URL.
            'ratio_digits_host': url.split('/')[2].replace(/\D/g, '').length / url.split('/')[2].length,
            // Tỷ lệ số chữ số trong phần tên máy chủ của URL, được tính bằng cách chia tổng số chữ số trong phần tên máy chủ cho độ dài của phần tên máy chủ, nếu có.
            'punycode': url.includes('xn--') ? 1 : 0,
            // URL có sử dụng mã hóa Punycode hay không
            'port': url.split('/')[2].split(':')[1] ? url.split('/')[2].split(':')[1] : 0,
            // Số cổng trong URL (nếu có)
            'tld_in_path': ['.com/', '.net/', '.org/'].some(tld => url.includes(tld)) ? 1 : 0,
            // Tên miền cấp cao nhất (TLD) xuất hiện trong đường dẫn của URL không
            'tld_in_subdomain': ['.com.', '.net.', '.org.'].some(tld => url.includes(tld)) ? 1 : 0,
            // Tên miền cấp cao nhất (TLD) xuất hiện trong phần con-domain của URL không
            'abnormal_subdomain': url.split('/')[2].split('.').length > 3 ? 1 : 0,
            // Phần con-domain của URL có chứa nhiều hơn 3 phần không (phần tên máy chủ bình thường, tên miền cấp cao nhất, và tên miền cấp cao nhất thứ hai) không
            'nb_subdomains': url.split('/')[2].split('.').length - 2,
            // Số lượng phần con-domain trong URL (trừ phần tên miền cấp cao nhất và tên miền cấp cao nhất thứ hai)
            'prefix_suffix': url.includes('www.') ? 1 : 0,
            // Tên miền phổ biến có xuất hiện trong phần đuôi của URL không
            'suspicious_tld': ['.info', '.ooo', '.xyz', '.pw', '.top'].some(tld => url.endsWith(tld)) ? 1 : 0,
            // Tên miền kết thúc bằng các phần mở rộng đáng ngờ như 'info', 'ooo', 'xyz', 'pw', 'top' không
            'statistical_report': ['click', 'report', 'stat'].some(keyword => url.includes(keyword)) ? 1 : 0,
            // Có xuất hiện các từ khóa thống kê như 'click', 'report', 'stat' trong URL không
            'nb_hyperlinks': (url.match(/<a href/g) || []).length,
            // Số lượng siêu liên kết ('<a href') trong HTML
            'nb_extCSS': (url.match(/<link rel="stylesheet"/g) || []).length,
            // Số lượng tệp CSS bên ngoài được liên kết trong HTML
            'ratio_intRedirection': (url.match(/http:\/\//g) || []).length / (url.match(/\/\//g) || []).length,
            // Tỷ lệ chuyển hướng nội bộ (bắt đầu bằng 'http://') so với tổng số chuyển hướng
            'ratio_extRedirection': (url.match(/http:\/\//g) || []).length / (url.match(/\/\//g) || []).length,
            // Tỷ lệ chuyển hướng ngoại (bắt đầu bằng 'http://') so với tổng số chuyển hướng
            'ratio_intErrors': (url.match(/http:\/\//g) || []).length / (url.match(/\/\//g) || []).length,
            // Tỷ lệ lỗi nội bộ (bắt đầu bằng 'http://') so với tổng số lỗi
            'ratio_extErrors': (url.match(/http:\/\//g) || []).length / (url.match(/\/\//g) || []).length,
            // Tỷ lệ lỗi ngoại (bắt đầu bằng 'http://') so với tổng số lỗi
            'login_form': url.includes('<form action="login"') ? 1 : 0,
            // Có biểu mẫu đăng nhập trong HTML không
            'external_favicon': url.includes('<link rel="icon"') ? 1 : 0,
            // Có biểu tượng trang web bên ngoài trong HTML
            'links_in_tags': url.includes('<script src') ? 1 : 0,
            // Có liên kết trong thẻ script trong HTML không
            'submit_email': url.includes('mailto:') ? 1 : 0,
            // Có một mẫu email trong HTML không
            'sfh': url.includes('<form action=""') ? 1 : 0,
            // Có một trường ẩn chứa một URL không
            'iframe': url.includes('<iframe') ? 1 : 0,
            // Có một thẻ iframe trong HTML không
            'popup_window': url.includes('window.open') ? 1 : 0,
            // Có một cửa sổ popup được mở bằng JavaScript không
            'safe_anchor': url.includes('window.open') ? 1 : 0,
            // Có một liên kết an toàn trong HTML không
            'onmouseover': url.includes('onmouseover') ? 1 : 0,
            // Có sự kiện onmouseover trong HTML không
            'right_click': url.includes('right-click') ? 1 : 0,
            // Có sự kiện click phải chuột trong HTML không
            'empty_title': url.includes('<title></title>') ? 1 : 0,
            // Có một thẻ title rỗng trong HTML không
            'domain_in_title': url.includes('<title>') && url.includes('</title>') ? 1 : 0,
            // Tên miền xuất hiện trong thẻ title của HTML không
            'domain_with_copyright': url.includes('©') ? 1 : 0,
            // Tên miền chứa ký tự bản quyền trong HTML không
            'whois_registered_domain': url.includes('Domain Name:') ? 1 : 0,
            // Tên miền đã đăng ký xuất hiện trong thông tin WHOIS không
            'domain_registration_length': url.includes('Registration Length:') ? 1 : 0,
            // Chiều dài đăng ký tên miền trong thông tin WHOIS không
            'domain_age': url.includes('Domain Age:') ? 1 : 0,
            // Tuổi tên miền trong thông tin WHOIS không
            'web_traffic': url.includes('http://') || url.includes('https://') ? 1 : 0,
            // Xác định xem URL có chứa 'http://' hoặc 'https://' hay không
            'dns_record': url.includes('http://') || url.includes('https://') ? 1 : 0,
            // Tương tự như 'web_traffic', xác định xem URL có chứa 'http://' hoặc 'https://' hay không
            'google_index': url.includes('http://') || url.includes('https://') ? 1 : 0,
            // Xác định xem URL có được Google index không
            'page_rank': url.includes('http://') || url.includes('https://') ? 1 : 0
            // Xác định xem URL có được Google page rank không
        };

        // Tạo tensor từ các đặc trưng
        const tensor = tf.tensor2d([Object.values(features)]);

        // Dự đoán với mô hình
        const prediction = model.predict(tensor);

        // Trả về kết quả dự đoán
        const result = prediction.dataSync()[0];
        return result;
    } catch (error) {
        console.error('Error:', error.message);
        throw new Error('Có lỗi xảy ra khi dự đoán.');
    }
}


// Hàm chính để thực hiện dự đoán với URL đầu vào
async function main(url) {
    try {
        const model = await loadModel();
        
        // Gọi hàm dự đoán với URL được cung cấp và mô hình đã tải
        const result = await predict(url, model);
        
        // Hiển thị kết quả dự đoán
        if (result < 0.5) {
            alert("Đây là link an toàn (không bị phishing)" + "\n" + "Tỉ lệ dự đoán: " + ((1 - result) * 100).toFixed(2) + "%");
        } else {
            alert("Đây là link có thể bị phishing!" + "\n" + "Tỉ lệ dự đoán: " + (result * 100).toFixed(2) + "%");
        }
    } catch (error) {
        console.error('Error:', error.message);
        alert('Có lỗi xảy ra khi dự đoán.');
    }
}