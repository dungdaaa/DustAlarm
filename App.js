import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ScrollView, Dimensions, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';

const { width: SCREEN_WIDTH} = Dimensions.get("window");

export default function App() {
  const [city, setCity] = useState("Loading...") //기본값
  const [location, setLocation] = useState();
  const [ok, setOk] = useState(true);
  const ask = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    
    if(!granted){ //유저의 권한 요청 거절 -> sad face
      setOk(false);
    }

    const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5});

    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
    setCity(location[0].city);
  }

  useEffect(() => {
    ask();
  }, []);

  ///////////////////////////time
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
  ///////////////////////////time

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
          <Text>Image</Text>
        </View>
        <View style = {styles.description}>
          <Text>Image's Description</Text>
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
              <Text style = {styles.detailValue}>value</Text>
            </View>
            <View style = {styles.detail}>
              <Text style = {styles.detailTitle}>초미세먼지</Text>
              <Text style = {styles.detailValue}>value</Text>
            </View>
            <View style = {styles.detail}>
              <Text style = {styles.detailTitle}>이산화질소</Text>
              <Text style = {styles.detailValue}>value</Text>
            </View>
            <View style = {styles.detail}>
              <Text style = {styles.detailTitle}>오존</Text>
              <Text style = {styles.detailValue}>value</Text>
            </View>
            <View style = {styles.detail}>
              <Text style = {styles.detailTitle}>일산화탄소</Text>
              <Text style = {styles.detailValue}>value</Text>
            </View>
            <View style = {styles.detail}>
              <Text style = {styles.detailTitle}>아황산가스</Text>
              <Text style = {styles.detailValue}>value</Text>
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
    backgroundColor: "#fafafa",
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
    backgroundColor: "#fafafa",
  },
  image: {
    flex: 8,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    flex: 2,
    backgroundColor: "yellow",
    justifyContent: "center",
    alignItems: "center",
  },

  bot: {
    flex: 2,
    backgroundColor: "#fafafa",
  },
  SV: {

  },
  detail: {
    backgroundColor: "blue",
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