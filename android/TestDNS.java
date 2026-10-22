import java.net.URL;
import java.net.HttpURLConnection;

public class TestDNS {
    public static void main(String[] args) {
        try {
            System.out.println("Testing dl.google.com...");
            URL url = new URL("https://dl.google.com/dl/android/maven2/index.html");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            int responseCode = connection.getResponseCode();
            System.out.println("Response Code: " + responseCode);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
