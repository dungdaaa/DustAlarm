import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ScrollView, Dimensions, StyleSheet, Text, View, Image, TouchableOpacity, Modal, Button } from 'react-native';
import * as Location from 'expo-location';
import {WebView} from 'react-native-webview';
import axios from 'axios';

const { width: SCREEN_WIDTH} = Dimensions.get("window");
const API_KEY = "b5a053a5069f13a3751d1adb80e453e0";
const KAKAO_MAPS_API_KEY = "7786ee326a539871a7b8759052c01034";

const getNearbyConvenienceStores = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=CS2&x=${longitude}&y=${latitude}&radius=1000`,
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_MAPS_API_KEY}`, // Replace YOUR_KAKAO_API_KEY with your actual Kakao API key
        },
      }
    );

    if (response.data.documents.length >= 2) {
      const store1 = response.data.documents[0].place_name;
      const store2 = response.data.documents[1].place_name;

      // Display the stores or do something with the data
      console.log('Nearest Convenience Stores:', store1, store2);
      return [store1, store2];
    } else {
      console.log('No nearby convenience stores found.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching nearby convenience stores:', error);
    return [];
  }
};

export default function App() {
  const [city, setCity] = useState("Loading...") //기본값
  //const [location, setLocation] = useState(); //delete..?
  const [currentAir, setCurrentAir] = useState({
    pm10: 0,
    pm25: 0,
    no2: 0,
    o3: 0,
    co: 0,
    so2: 0,
  });
  const [ok, setOk] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [nearbyStores, setNearbyStores] = useState([]);

  //location & airPollution
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    
    if(!granted){ //유저의 권한 요청 거절 -> sad face
      setOk(false);
    }

    const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5});

    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
    setCity(location[0].city);

    const response = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
    const json = await response.json();

    //co nh3 no no2 o3 pm10 pm2_5 so2
    setCurrentAir({
      pm10: json.list[0].components.pm10,
      pm25: json.list[0].components.pm2_5,
      no2: json.list[0].components.no2,
      o3: json.list[0].components.o3,
      co: json.list[0].components.co,
      so2: json.list[0].components.so2,
    });
    try {
      const stores = await getNearbyConvenienceStores(latitude, longitude);
      setNearbyStores(stores);
    } catch (error) {
      console.error('가까운 편의점 정보를 가져오는 중 오류 발생:', error);
    }
  };
  
  useEffect(() => {
    getWeather();
  }, []);

  //date
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const dateInterval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(dateInterval);
  }, []);

  //time
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  //Image Description
  const getAirQualityStatus = () => {
    const pm10 = currentAir.pm10;

    if(pm10 <= 20){
      return "매우 좋음";
    } else if(pm10 <= 50){
      return "좋음";
    } else if(pm10 <= 100){
      return "보통";
    } else if(pm10 <= 200){
      return "나쁨";
    } else {
      return "매우 나쁨";
    }
  };

  //Image Description Detail
  const getAirQualityStatusDescription = () => {
    const pm10 = currentAir.pm10;

    if(pm10 <= 20){
      return "신선한 공기 잔뜩 마시세요";
    } else if(pm10 <= 50){
      return "외출해도 좋아요";
    } else if(pm10 <= 100){
      return "무난한 날이에요";
    } else if(pm10 <= 200){
      return "외출을 자제해 주세요";
    } else {
      return "마스크를 꼭 착용합시다";
    }
  };

  //Image
  const getDustImage = () => {
    const pm10 = currentAir.pm10;
    if(pm10 <= 20){
      return require('./assets/mise_verynice.png');
    } else if(pm10 <= 50){
      return require('./assets/mise_nice.png');
    } else if(pm10 <= 100){
      return require('./assets/mise_mid.png');
    } else if(pm10 <= 200){
      return require('./assets/mise_bad.png')
    } else {
      return require('./assets/mise_verybad.png');
    }
  };

  //미세먼지 pm10
  const getPm10_SV = () => {
    const pm10 = currentAir.pm10;

    if(pm10 <= 20){
      return "매우 좋음";
    } else if(pm10 <= 50){
      return "좋음";
    } else if(pm10 <= 100){
      return "보통";
    } else if(pm10 <= 200){
      return "나쁨";
    } else{
      return "매우 나쁨";
    }
  };

  //초미세먼지 pm25
  const getPm25_SV = () => {
    const pm25 = currentAir.pm25;

    if(pm25 <= 10){
      return "매우 좋음";
    } else if(pm25 <= 25){
      return "좋음";
    } else if(pm25 <= 50){
      return "보통";
    } else if(pm25 <= 75){
      return "나쁨";
    } else{
      return "매우 나쁨";
    }
  };

  //이산화질소 no
  const getNo2_SV = () => {
    const no2 = currentAir.no2;

    if(no2 <= 40){
      return "매우 좋음";
    } else if(no2 <= 70){
      return "좋음";
    } else if(no2 <= 150){
      return "보통";
    } else if(no2 <= 200){
      return "나쁨";
    } else{
      return "매우 나쁨";
    }
  };

  //오존 o3
  const getO3_SV = () => {
    const o3 = currentAir.o3;

    if(o3 <= 60){
      return "매우 좋음";
    } else if(o3 <= 100){
      return "좋음";
    } else if(o3 <= 140){
      return "보통";
    } else if(o3 <= 180){
      return "나쁨";
    } else{
      return "매우 나쁨";
    }
  };

  //일산화탄소 co
  const getCo_SV = () => {
    const co = currentAir.co;

    if(co <= 4400){
      return "매우 좋음";
    } else if(co <= 9400){
      return "좋음";
    } else if(co <= 12400){
      return "보통";
    } else if(co <= 15400){
      return "나쁨";
    } else{
      return "매우 나쁨";
    }
  }

  //아황산가스 so2
  const getSo2_SV = () => {
    const so2 = currentAir.so2;

    if(so2 <= 20){
      return "매우 좋음";
    } else if(so2 <= 80){
      return "좋음";
    } else if(so2 <= 250){
      return "보통";
    } else if(so2 <= 350){
      return "나쁨";
    } else{
      return "매우 나쁨";
    }
  }

  return (
    <View style = {styles.container}>
      <StatusBar style='dark'/>

      <View style = {styles.top}>
        <View style = {styles.city}>
          <Text style = {styles.cityName}>{city}</Text>
        </View>
        <View style = {styles.date}>
          <Text style = {styles.dateName}>{currentDate.toLocaleDateString()} {currentTime.toLocaleTimeString()}</Text>
        </View>
      </View>

      <View style = {styles.mid}>
        <View style = {styles.image}>
        <Image
            source={getDustImage()}
            style={{width: '100%', height: '100%', resizeMode: 'cover'}}
          />
        </View>
        <View style = {styles.description}>
          <Text style = {styles.imageDescription}>{getAirQualityStatus()}</Text>
          <Text style = {styles.imageDescriptionDetail}>{getAirQualityStatusDescription()}</Text>
        </View>
      </View>

      <View style = {styles.bot}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator = "false"
            contentContainerStyle = {styles.SV}
          >
            <View style = {styles.detail}>
              <Text style = {styles.detailTitle}>미세먼지</Text>
              <Text style = {styles.detailDescription}>{getPm10_SV()}</Text>
              <Text style = {styles.detailValue}>{currentAir.pm10}</Text>
            </View>
            <View style = {styles.detail}>
              <Text style = {styles.detailTitle}>초미세먼지</Text>
              <Text style = {styles.detailDescription}>{getPm25_SV()}</Text>
              <Text style = {styles.detailValue}>{currentAir.pm25}</Text>
            </View>
            <View style = {styles.detail}>
              <Text style = {styles.detailTitle}>이산화질소</Text>
              <Text style = {styles.detailDescription}>{getNo2_SV()}</Text>
              <Text style = {styles.detailValue}>{currentAir.no2}</Text>
            </View>
            <View style = {styles.detail}>
              <Text style = {styles.detailTitle}>오존</Text>
              <Text style = {styles.detailDescription}>{getO3_SV()}</Text>
              <Text style = {styles.detailValue}>{currentAir.o3}</Text>
            </View>
            <View style = {styles.detail}>
              <Text style = {styles.detailTitle}>일산화탄소</Text>
              <Text style = {styles.detailDescription}>{getCo_SV()}</Text>
              <Text style = {styles.detailValue}>{currentAir.co}</Text>
            </View>
            <View style = {styles.detail}>
              <Text style = {styles.detailTitle}>아황산가스</Text>
              <Text style = {styles.detailDescription}>{getSo2_SV()}</Text>
              <Text style = {styles.detailValue}>{currentAir.so2}</Text>
            </View>
          </ScrollView>
      </View>
      <TouchableOpacity
        style={styles.icon}
        onPress={() => setModalVisible(true)}
      >
        <Image
          source={require('./assets/mask_icon.png')}
          style={{ width: 50, height: 50, resizeMode: 'cover' }}
        />
      </TouchableOpacity>

      {/* Modal for displaying nearby convenience stores */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>주변 편의점에서 마스크를 구매하세요!</Text>
            {nearbyStores.map((store, index) => (
              <Text key={index} style={styles.modalStore}>{index + 1}. {store}</Text>
            ))}
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  top: {
    flex: 2.3,
  },
  city: {
    flex: 8,
    //backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 50,
    fontWeight: "500",
    marginTop: 92, //move down
  },
  date: {
    flex: 2,
    //backgroundColor: "teal",
    justifyContent: "center",
    alignItems: "center",
  },
  dateName: {
    fontSize: 19,
  },

  mid: {
    flex: 5.2,
  },
  image: {
    flex: 8,
    //backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: -20,
  },
  description: {
    flex: 2,
    //backgroundColor: "yellow",
    justifyContent: "center",
    alignItems: "center",
    
  },
  imageDescription: {
    fontSize: 46,
    marginBottom: 3,
  },
  imageDescriptionDetail:{
    fontSize: 17,
  },

  bot: {
    flex: 2.5,
  },
  SV: {
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginTop: 25,
  },
  detail: {
    //backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    width: SCREEN_WIDTH / 3,
  },
  detailTitle: {
    fontSize: 23,
  },
  detailDescription:{
    fontSize: 18,
  },
  detailValue: {
    fontSize: 15,
  },
  icon: {
    position: 'absolute',
    top: 55,
    right: 10,
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: SCREEN_WIDTH - 40,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalStore: {
    fontSize: 16,
    marginBottom: 5,
  },
});