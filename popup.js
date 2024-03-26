// // Xử lý sự kiện khi DOM đã được load hoàn tất
// document.addEventListener('DOMContentLoaded', function() {
//     // Sử dụng chrome.tabs API để lấy thông tin về tab hiện tại
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         // Lấy URL của trang web hiện tại từ thông tin về tab
//         var currentUrl = tabs[0].url;
        
//         // Gán URL vào thẻ input
//         document.getElementById('urlInput').value = currentUrl;

//         // Xử lý sự kiện khi nút "Check Phishing" được nhấp vào
//         document.getElementById('checkButton').addEventListener('click', function() {
//             // Lấy URL từ input
//             var url = document.getElementById('urlInput').value;
//             // Kiểm tra xem URL có tồn tại không
//             if (url) {
//                 // Gọi hàm dự đoán với URL nhận được
//                 var result = main(url);
//             } else {
//                 alert("Vui lòng nhập url để kiểm tra.");
//             }
//         });
//     });
// });

// // Tạo mạng FFNN với Brain.js
// const net = new brain.NeuralNetwork();
// function predict(url) {
//     return {
//         'length_url': url.length,
//         // Độ dài của URL
//         'length_hostname': url.split('/')[2].length,
//         // Độ dài của tên máy chủ (hostname) trong URL. Nó được tính bằng cách tách chuỗi URL bằng dấu '/' và lấy độ dài của phần tử thứ ba (index 2).
//         'ip': url.split('/')[2].replace('.', '').match(/^\d+$/) !== null ? 1 : 0,
//         // Xác định xem URL có phải là địa chỉ IP hay không. Nếu phần tử thứ ba sau khi tách chuỗi URL bằng dấu '/' là một địa chỉ IP (chỉ chứa các số và dấu chấm), thì được gán giá trị 1, ngược lại là 0.
//         'nb_dots': url.split('.').length - 1,
//         // Số lượng dấu chấm trong URL
//         'nb_hyphens': url.split('-').length - 1,
//         // Số lượng dấu gạch ngang trong URL
//         'nb_at': url.split('@').length - 1,
//         // Số lượng ký tự '@' trong URL
//         'nb_qm': url.split('?').length - 1,
//         // Số lượng ký tự '?' trong URL
//         'nb_and': url.split('&').length - 1,
//         // Số lượng ký tự '&' trong URL
//         'nb_or': url.split('|').length - 1,
//         // Số lượng ký tự '|' trong URL
//         'nb_eq': url.split('=').length - 1,
//         // Số lượng ký tự '=' trong URL
//         'nb_underscore': url.split('_').length - 1,
//         // Số lượng ký tự '_' trong URL
//         'nb_tilde': url.split('~').length - 1,
//         // Số lượng ký tự '~' trong URL
//         'nb_percent': url.split('%').length - 1,
//         // Số lượng ký tự '%' trong URL
//         'nb_slash': url.split('/').length - 1,
//         // Số lượng dấu gạch chéo trong URL
//         'nb_star': url.split('*').length - 1,
//         // Số lượng ký tự '*' trong URL
//         'nb_colon': url.split(':').length - 1,
//         // Số lượng dấu hai chấm trong URL
//         'nb_comma': url.split(',').length - 1,
//         // Số lượng dấu phẩy trong URL
//         'nb_semicolon': url.split(';').length - 1,
//         // Số lượng dấu chấm phẩy trong URL
//         'nb_dollar': url.split('$').length - 1,
//         // Số lượng ký tự '$' trong URL
//         'nb_space': url.split(' ').length - 1,
//         // Số lượng dấu cách trong URL
//         'nb_www': url.includes('www') ? 1 : 0,
//         // Có chứa 'www' trong URL không
//         'nb_com': url.includes('.com') ? 1 : 0,
//         // Có chứa '.com' trong URL không
//         'nb_dslash': url.includes('//') ? 1 : 0,
//         // Có chứa hai dấu gạch chéo liền nhau trong URL không
//         'http_in_path': url.includes('http') ? 1 : 0,
//         // 'http' xuất hiện trong đường dẫn của URL không
//         'https_token': url.includes('https') ? 1 : 0,
//         // 'https' xuất hiện trong URL không
//         'ratio_digits_url': url.replace(/\D/g, '').length / url.length,
//         // Tỷ lệ số chữ số trong URL, được tính bằng cách chia tổng số chữ số trong URL cho độ dài của URL.
//         'ratio_digits_host': url.split('/')[2].replace(/\D/g, '').length / url.split('/')[2].length,
//         // Tỷ lệ số chữ số trong phần tên máy chủ của URL, được tính bằng cách chia tổng số chữ số trong phần tên máy chủ cho độ dài của phần tên máy chủ, nếu có.
//         'punycode': url.includes('xn--') ? 1 : 0,
//         // URL có sử dụng mã hóa Punycode hay không
//         'port': url.split('/')[2].split(':')[1] ? url.split('/')[2].split(':')[1] : 0,
//         // Số cổng trong URL (nếu có)
//         'tld_in_path': ['.com/', '.net/', '.org/'].some(tld => url.includes(tld)) ? 1 : 0,
//         // Tên miền cấp cao nhất (TLD) xuất hiện trong đường dẫn của URL không
//         'tld_in_subdomain': ['.com.', '.net.', '.org.'].some(tld => url.includes(tld)) ? 1 : 0,
//         // Tên miền cấp cao nhất (TLD) xuất hiện trong phần con-domain của URL không
//         'abnormal_subdomain': url.split('/')[2].split('.').length > 3 ? 1 : 0,
//         // Phần con-domain của URL có chứa nhiều hơn 3 phần không (phần tên máy chủ bình thường, tên miền cấp cao nhất, và tên miền cấp cao nhất thứ hai) không
//         'nb_subdomains': url.split('/')[2].split('.').length - 2,
//         // Số lượng phần con-domain trong URL (trừ phần tên miền cấp cao nhất và tên miền cấp cao nhất thứ hai)
//         'prefix_suffix': url.includes('www.') ? 1 : 0,
//         // Tên miền phổ biến có xuất hiện trong phần đuôi của URL không
//         'suspicious_tld': ['.info', '.ooo', '.xyz', '.pw', '.top'].some(tld => url.endsWith(tld)) ? 1 : 0,
//         // Tên miền kết thúc bằng các phần mở rộng đáng ngờ như 'info', 'ooo', 'xyz', 'pw', 'top' không
//         'statistical_report': ['click', 'report', 'stat'].some(keyword => url.includes(keyword)) ? 1 : 0,
//         // Có xuất hiện các từ khóa thống kê như 'click', 'report', 'stat' trong URL không
//         'nb_hyperlinks': (url.match(/<a href/g) || []).length,
//         // Số lượng siêu liên kết ('<a href') trong HTML
//         'nb_extCSS': (url.match(/<link rel="stylesheet"/g) || []).length,
//         // Số lượng tệp CSS bên ngoài được liên kết trong HTML
//         'ratio_intRedirection': (url.match(/http:\/\//g) || []).length / (url.match(/\/\//g) || []).length,
//         // Tỷ lệ chuyển hướng nội bộ (bắt đầu bằng 'http://') so với tổng số chuyển hướng
//         'ratio_extRedirection': (url.match(/http:\/\//g) || []).length / (url.match(/\/\//g) || []).length,
//         // Tỷ lệ chuyển hướng ngoại (bắt đầu bằng 'http://') so với tổng số chuyển hướng
//         'ratio_intErrors': (url.match(/http:\/\//g) || []).length / (url.match(/\/\//g) || []).length,
//         // Tỷ lệ lỗi nội bộ (bắt đầu bằng 'http://') so với tổng số lỗi
//         'ratio_extErrors': (url.match(/http:\/\//g) || []).length / (url.match(/\/\//g) || []).length,
//         // Tỷ lệ lỗi ngoại (bắt đầu bằng 'http://') so với tổng số lỗi
//         'login_form': url.includes('<form action="login"') ? 1 : 0,
//         // Có biểu mẫu đăng nhập trong HTML không
//         'external_favicon': url.includes('<link rel="icon"') ? 1 : 0,
//         // Có biểu tượng trang web bên ngoài trong HTML
//         'links_in_tags': url.includes('<script src') ? 1 : 0,
//         // Có liên kết trong thẻ script trong HTML không
//         'submit_email': url.includes('mailto:') ? 1 : 0,
//         // Có một mẫu email trong HTML không
//         'sfh': url.includes('<form action=""') ? 1 : 0,
//         // Có một trường ẩn chứa một URL không
//         'iframe': url.includes('<iframe') ? 1 : 0,
//         // Có một thẻ iframe trong HTML không
//         'popup_window': url.includes('window.open') ? 1 : 0,
//         // Có một cửa sổ popup được mở bằng JavaScript không
//         'safe_anchor': url.includes('window.open') ? 1 : 0,
//         // Có một liên kết an toàn trong HTML không
//         'onmouseover': url.includes('onmouseover') ? 1 : 0,
//         // Có sự kiện onmouseover trong HTML không
//         'right_click': url.includes('right-click') ? 1 : 0,
//         // Có sự kiện click phải chuột trong HTML không
//         'empty_title': url.includes('<title></title>') ? 1 : 0,
//         // Có một thẻ title rỗng trong HTML không
//         'domain_in_title': url.includes('<title>') && url.includes('</title>') ? 1 : 0,
//         // Tên miền xuất hiện trong thẻ title của HTML không
//         'domain_with_copyright': url.includes('©') ? 1 : 0,
//         // Tên miền chứa ký tự bản quyền trong HTML không
//         'whois_registered_domain': url.includes('Domain Name:') ? 1 : 0,
//         // Tên miền đã đăng ký xuất hiện trong thông tin WHOIS không
//         'domain_registration_length': url.includes('Registration Length:') ? 1 : 0,
//         // Chiều dài đăng ký tên miền trong thông tin WHOIS không
//         'domain_age': url.includes('Domain Age:') ? 1 : 0,
//         // Tuổi tên miền trong thông tin WHOIS không
//         'web_traffic': url.includes('http://') || url.includes('https://') ? 1 : 0,
//         // Xác định xem URL có chứa 'http://' hoặc 'https://' hay không
//         'dns_record': url.includes('http://') || url.includes('https://') ? 1 : 0,
//         // Tương tự như 'web_traffic', xác định xem URL có chứa 'http://' hoặc 'https://' hay không
//         'google_index': url.includes('http://') || url.includes('https://') ? 1 : 0,
//         // Xác định xem URL có được Google index không
//         'page_rank': url.includes('http://') || url.includes('https://') ? 1 : 0
//         // Xác định xem URL có được Google page rank không
//     };
// }

// //Trong Chrome Extension, bạn cần sử dụng chrome.runtime.getURL() để lấy đường dẫn tới tệp CSV
// const csvUrl = chrome.runtime.getURL('./processed_train_10.csv');
// const headers = []; // Mảng lưu trữ tiêu đề cột
// let trainingData1 = []; // Mảng lưu trữ dữ liệu đã được chuẩn bị

// // Trong JavaScript, await là một từ khóa được sử dụng trong hàm bất đồng bộ (asynchronous function) để đợi (hoặc chờ) 
// // một Promise hoàn thành và trả về kết quả.
// async function fetchData(url) {
//     try {
//         // chứa thông tin như mã trạng thái của phản hồi, tiêu đề và nội dung của phản hồi.
//       const response = await fetch(csvUrl);
//       // phương thức text() được sử dụng để biến đổi nội dung của phản hồi thành văn bản.
//       const csvData = await response.text();
  
//       const rows = csvData.trim().split('\n');
//       // loại bỏ khoảng trắng cả 2 đầu chuỗi
//       headers.push(...rows.shift().split(','));
//         // Hàm shift() được sử dụng để loại bỏ và trả về phần tử đầu tiên của mảng rows
//         // split được sử dụng để chia chuỗi thành một mảng các chuỗi con, sử dụng dấu phẩy (,) làm dấu phân cách

//       // Lặp qua từng hàng dữ liệu và chuyển đổi thành định dạng input-output
//       // arrIndex tương ứng với chỉ số của hàng dữ liệu hiện tại trong mảng rows
//       rows.forEach((row, arrIndex) => {
//         //tách hàng thánh các giá trị riêng biệt
//         const values = row.split(',');
//         const features = {};
//         const output = [];
  
//         // Chuyển đổi từng giá trị thành số và gán cho các đặc trưng tương ứng
//         values.forEach((value, index) => {
//           if (headers[index] !== 'status') {
//             features[headers[index]] = parseFloat(value);
//           } else {
//             output.push(parseFloat(value));
//           }
//         });
  
//         // Đẩy dữ liệu vào mảng trainingData1
//         trainingData1[arrIndex] = { input: features, output: output };
//       });

//       console.log(trainingData1)

//       net.train(trainingData1);
//       const result = net.run(predict(url));      
//       return result[0]

//     } catch (error) {
//       console.error('Error fetching or processing data:', error);
//     }
//   }

//   // ịnh nghĩa một hàm main(url) là một hàm bất đồng bộ (async function
// async function main(url) {

//     // Gọi hàm predict để lấy các tính năng từ URL
//     const features = predict(url);

//     // In ra các tính năng từ URL
//     console.log("Các features từ URL đầu vào:");
//     // console.log(features);

//     fetchData(url).then(result => {
//         console.log(result);
//         if (result < 0.5) 
//         {
//             alert ("Đây là link an toàn ( không bị phishing )" );
//         } else {
//             alert("Đây là link có thể bị phishing!");
//         }
//         // Thực hiện các hành động khác với kết quả
//       }).catch(error => {
//         console.error('Error:', error);
//       });
//   }



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
              var result = main(url);
              // console.log(final);
              // alert(result);

          } else {
              alert("Vui lòng nhập url để kiểm tra.");
          }
      });
  });
});

// Tạo mạng FFNN với Brain.js
const net = new brain.NeuralNetwork();
function predict(url) {
  return {
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

  

  // fetch(csvUrl)
  //     .then(response => response.text())
  //     .then(csvData => {
  //         const rows = csvData.trim().split('\n');
  //         // Lấy tiêu đề từ hàng đầu tiên và chia thành các cột
  //         headers.push(...rows.shift().split(','));
          
  //         // Lặp qua từng hàng dữ liệu và chuyển đổi thành định dạng input-output
  
  //         // In ra mảng trainingData1 sau khi đã xử lý
  //         // console.log(trainingData1);

  //         rows.forEach((row, arrIndex) => {
  //             const values = row.split(',');
  //             const features = {};
  //             const output = [];
  
  //             // Chuyển đổi từng giá trị thành số và gán cho các đặc trưng tương ứng
  //             values.forEach((value, index) => {
  //                 if (headers[index] !== 'status') { 
  //                     features[headers[index]] = parseFloat(value);
  //                 } else {
  //                     output.push(parseFloat(value));
  //                 }
  //             });
  
  //             // Đẩy dữ liệu vào mảng trainingData1
  //             trainingData1[arrIndex] = ({ input: features, output: output })
  //         });
  //         net.train(trainingData1);
  //         result = net.run(urlFeatures);
  //         return result[0]

  //     })
  //     // .then(result => {
  //     //     if (result[0] < 0.5) {
  //     //         return "Đây là link an toàn ( không bị phishing )" + "\n" + "Tỉ lệ dự đoán: "+ ((1 - result[0]) * 100).toFixed(2) + "%" ;
  //     //     } else {
  //     //         return "Đây là link có thể bị phishing!" + "\n" + "Tỉ lệ dự đoán: " + (result[0] * 100).toFixed(2) + "%";
  //     //     }
  //     // })
  //     .catch(error => {
  //         console.error('Error fetching or processing data:', error);
  //     });
      
}

// Lưu ý: Trong Chrome Extension, bạn cần sử dụng chrome.runtime.getURL() để lấy đường dẫn tới tệp CSV của bạn
const csvUrl = chrome.runtime.getURL('./processed_train_10.csv');
const headers = []; // Mảng lưu trữ tiêu đề cột
let trainingData1 = []; // Mảng lưu trữ dữ liệu đã được chuẩn bị


async function fetchData(url) {
  try {
    const response = await fetch(csvUrl);
    const csvData = await response.text();

    const rows = csvData.trim().split('\n');
    headers.push(...rows.shift().split(','));
    // Lặp qua từng hàng dữ liệu và chuyển đổi thành định dạng input-output
    rows.forEach((row, arrIndex) => {
      const values = row.split(',');
      const features = {};
      const output = [];

      // Chuyển đổi từng giá trị thành số và gán cho các đặc trưng tương ứng
      values.forEach((value, index) => {
        if (headers[index] !== 'status') {
          features[headers[index]] = parseFloat(value);
        } else {
          output.push(parseFloat(value));
        }
      });

      // Đẩy dữ liệu vào mảng trainingData1
      trainingData1[arrIndex] = { input: features, output: output };
    });

    net.train(trainingData1);
    const result = net.run(predict(url));
    final = result[0];
    return result[0]
  } catch (error) {
    console.error('Error fetching or processing data:', error);
  }
}

async function main(url) {
  fetchData(url).then(result => {
      if (result < 0.5) 
      {
          alert ("Đây là link an toàn ( không bị phishing )" + "\n" + "Tỉ lệ dự đoán: "+ ((1 - result) * 100).toFixed(2) + "%" );
      } else {
          alert("Đây là link có thể bị phishing!" + "\n" + "Tỉ lệ dự đoán: " + (result * 100).toFixed(2) + "%");
      }
      // Thực hiện các hành động khác với kết quả
    }).catch(error => {
      console.error('Error:', error);
    });
}
