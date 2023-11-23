import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ScrollView, Dimensions, StyleSheet, Text, View, Image } from 'react-native';
import * as Location from 'expo-location';

const { width: SCREEN_WIDTH} = Dimensions.get("window");
const API_KEY = "b5a053a5069f13a3751d1adb80e453e0";

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
  ///////////////////////////location & airPollution
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
  };
  ///////////////////////////location & airPollution
  
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

  const getAirQualityStatus = () => {
    const pm10 = currentAir.pm10;

    if(pm10 <= 20){
      return "매우좋음";
    } else if(pm10 <= 50){
      return "좋음";
    } else if(pm10 <= 100){
      return "보통";
    } else if(pm10 <= 200){
      return "나쁨";
    } else {
      return "매우나쁨";
    }
  };

  //Image Description Detail
  const getAirQualityStatusDescription = () => {
    const pm10 = currentAir.pm10;

    if(pm10 <= 20){
      return "설명";
    } else if(pm10 <= 50){
      return "설명";
    } else if(pm10 <= 100){
      return "설명";
    } else if(pm10 <= 200){
      return "설명";
    } else {
      return "설명";
    }
  };

  //미세먼지 농도에 따른 이미지 경로 지정
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
      return "매우좋음";
    } else if(pm10 <= 50){
      return "좋음";
    } else if(pm10 <= 100){
      return "보통";
    } else if(pm10 <= 200){
      return "나쁨";
    } else{
      return "매우나쁨";
    }
  };

  //초미세먼지 pm25
  const getPm25_SV = () => {
    const pm25 = currentAir.pm25;

    if(pm25 <= 10){
      return "매우좋음";
    } else if(pm25 <= 25){
      return "좋음";
    } else if(pm25 <= 50){
      return "보통";
    } else if(pm25 <= 75){
      return "나쁨";
    } else{
      return "매우나쁨";
    }
  };

  //이산화질소 no
  const getNo2_SV = () => {
    const no2 = currentAir.no2;

    if(no2 <= 40){
      return "매우좋음";
    } else if(no2 <= 70){
      return "좋음";
    } else if(no2 <= 150){
      return "보통";
    } else if(no2 <= 200){
      return "나쁨";
    } else{
      return "매우나쁨";
    }
  };

  //오존 o3
  const getO3_SV = () => {
    const o3 = currentAir.o3;

    if(o3 <= 60){
      return "매우좋음";
    } else if(o3 <= 100){
      return "좋음";
    } else if(o3 <= 140){
      return "보통";
    } else if(o3 <= 180){
      return "나쁨";
    } else{
      return "매우나쁨";
    }
  };

  //일산화탄소 co
  const getCo_SV = () => {
    const co = currentAir.co;

    if(co <= 4400){
      return "매우좋음";
    } else if(co <= 9400){
      return "좋음";
    } else if(co <= 12400){
      return "보통";
    } else if(co <= 15400){
      return "나쁨";
    } else{
      return "매우나쁨";
    }
  }

  //아황산가스 so2
  const getSo2_SV = () => {
    const so2 = currentAir.so2;

    if(so2 <= 20){
      return "매우좋음";
    } else if(so2 <= 80){
      return "좋음";
    } else if(so2 <= 250){
      return "보통";
    } else if(so2 <= 350){
      return "나쁨";
    } else{
      return "매우나쁨";
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
          <Text>{getAirQualityStatus()}</Text>
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
              <Text>{getPm10_SV()}</Text>
              <Text style = {styles.detailValue}>{currentAir.pm10}</Text>
            </View>
            <View style = {styles.detail}>
              <Text style = {styles.detailTitle}>초미세먼지</Text>
              <Text>{getPm25_SV()}</Text>
              <Text style = {styles.detailValue}>{currentAir.pm25}</Text>
            </View>
            <View style = {styles.detail}>
              <Text style = {styles.detailTitle}>이산화질소</Text>
              <Text>{getNo2_SV()}</Text>
              <Text style = {styles.detailValue}>{currentAir.no2}</Text>
            </View>
            <View style = {styles.detail}>
              <Text style = {styles.detailTitle}>오존</Text>
              <Text>{getO3_SV()}</Text>
              <Text style = {styles.detailValue}>{currentAir.o3}</Text>
            </View>
            <View style = {styles.detail}>
              <Text style = {styles.detailTitle}>일산화탄소</Text>
              <Text>{getCo_SV()}</Text>
              <Text style = {styles.detailValue}>{currentAir.co}</Text>
            </View>
            <View style = {styles.detail}>
              <Text style = {styles.detailTitle}>아황산가스</Text>
              <Text>{getSo2_SV()}</Text>
              <Text style = {styles.detailValue}>{currentAir.so2}</Text>
            </View>
          </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  top: {
    flex: 2.5,
    //backgroundColor: "#fafafa",
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
    marginTop: 100, //move down
  },
  date: {
    flex: 2,
    //backgroundColor: "teal",
    justifyContent: "center",
    alignItems: "center",
  },
  dateName: {
    marginBottom: 20,
  },

  mid: {
    flex: 5.5,
    //backgroundColor: "#fafafa",
  },
  image: {
    flex: 8,
    //backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    flex: 2,
    //backgroundColor: "yellow",
    justifyContent: "center",
    alignItems: "center",
    //크기 조절
  },

  bot: {
    flex: 2,
    //backgroundColor: "#fafafa",
  },
  SV: {

  },
  detail: {
    //backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    width: SCREEN_WIDTH / 3,
  },
  detailTitle: {
    fontSize: 25,
  },
  detailValue: {
    fontSize: 20,
  },
})