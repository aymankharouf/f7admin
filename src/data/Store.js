import React, { createContext, useReducer, useEffect, useState } from 'react';
import Reducer from './Reducer'
import firebase from './firebase'

export const StoreContext = createContext()

const Store = props => {
  const sections = [
    {id: '1', name: 'بقوليات', percent: 5},
    {id: '2', name: 'سكاكر', percent: 10},
    {id: '3', name: 'معلبات', percent: 5},
    {id: '4', name: 'منظفات', percent: 10},
    {id: '5', name: 'زيوت', percent: 5}
    ]
  
  const randomColors = [
    {id: '0', name: 'red'},
    {id: '1', name: 'green'},
    {id: '2', name: 'blue'},
    {id: '3', name: 'pink'},
    {id: '4', name: 'yellow'},
    {id: '5', name: 'orange'},
    {id: '6', name: 'purple'},
    {id: '7', name: 'deeppurple'},
    {id: '8', name: 'lightblue'},
    {id: '9', name: 'teal'},
    {id: '10', name: 'lime'},
    {id: '11', name: 'deeporange'},
    {id: '12', name: 'gray'}
  ]
  const categories = [
    {id: '1', section: '1', name: 'رز'},
    {id: '2', section: '1', name: 'رز بسمتي'},
    {id: '3', section: '1', name: 'عدس حب'},
    {id: '4', section: '1', name: 'عدس مجروش'},
    {id: '5', section: '1', name: 'برغل'},
    {id: '6', section: '1', name: 'فريكة'},
    {id: '7', section: '1', name: 'فاصولياء'},
    {id: '8', section: '1', name: 'حمص'},
    {id: '9', section: '1', name: 'ذرة'},
    {id: '10', section: '2', name: 'فول'},
    {id: '11', section: '2', name: 'حمص'},
    {id: '12', section: '2', name: 'ذرة'},
    {id: '13', section: '2', name: 'فاصولياء'},
    {id: '14', section: '2', name: 'فاصولياء حمراء'}
  ]
  const locations = [
    {id: '1', name: 'جبل النزهة'},
    {id: '2', name: 'ضاحية اﻻمير حسن'},
    {id: '3', name: 'عرجان'},
    {id: '4', name: 'جبل الحسين'},
    {id: '5', name: 'مخيم جبل الحسين'}
  ]
  const trademarks = [
    {id: '1', name: 'نستلة'},
    {id: '2', name: 'جالاكسي'},
    {id: '3', name: 'صن وايت'},
    {id: '4', name: 'صن بيرد'},
    {id: '5', name: 'الكسيح'},
    {id: '6', name: 'شعبان'},
    {id: '7', name: 'الاسرة'},
    {id: '8', name: 'الدرة'}
  ]
  const orderByList = [
    {id: '0', name: 'بلا'},
    {id: '1', name: 'القيمة'},
    {id: '2', name: 'السعر'},
    {id: '3', name: 'المبيعات'},
    {id: '4', name: 'التقييم'},
    {id: '5', name: 'اﻻحدث'},
    {id: '6', name: 'العلامة التجارية'}
  ]
  const countries = [
    {id: '1', name: 'الاردن'},
    {id: '2', name: 'الصين'},
    {id: '3', name: 'سوريا'},
    {id: '4', name: 'مصر'},
    {id: '5', name: 'السعودية'}
  ]
  const units = [
    {id: '1', name: 'حبة'},
    {id: '2', name: 'غرام'},
    {id: '3', name: 'كيلو غرام'},
    {id: '4', name: 'مل لتر'},
    {id: '5', name: 'لتر'}
  ]
  const orderUnitTypes = [
    {id: '1', name: 'عبوة'},
    {id: '2', name: 'بالوزن'}
  ]
  const stores = [
    {id: '1', name: 'حريص', type: 'i'},
    {id: '2', name: 'ربوع القدس', type: 'm'},
    {id: '3', name: 'كارفور', type: 's'},
    {id: '4', name: 'سي تاون', type: 's'},
    {id: '5', name: 'سامح', type: 's'},
    {id: '6', name: 'جملة 1', type: 'w'},
    {id: '7', name: 'جملة 2', type: 'w'}
  ]
  const orderStatus = [
    {id: 1, name: 'قيد التسليم'},
    {id: 2, name: 'تم اﻻستلام'},
    {id: 3, name: 'ملغي'}
  ]  
  const storeTypes = [
    {id: 'i', name: 'مستودع'},
    {id: 'm', name: 'محل'},
    {id: 's', name: 'سوبرماركت'},
    {id: 'w', name: 'محل جملة'}
  ]  
  const labels = {
    appTitle: 'حريص',
    news: 'آخر الاخبار',
    offers: 'العروض',
    popular: 'اﻻكثر مبيعا',
    registerTitle: 'التسجيل ﻷول مرة',
    name: 'اﻻسم',
    mobile: 'الموبايل',
    password: 'كلمة السر',
    location: 'الموقع',
    register: 'تسجيل',
    error: 'خطأ',
    not_found: 'ﻻ يوجد بيانات',
    search: 'بحث',
    password_placeholder: '4 ارقام',
    name_placeholder: 'من 4-50 حرف',
    mobile_placeholder: 'يجب ان يبدأ ب07',
    open_order_found: 'هناك طلبية سابقة لم يتم استلامها',
    auth_user_not_found: 'الرجاء التأكد من رقم الموبايل وكلمة المرور',
    auth_email_already_in_use: 'لقد سجلت سابقا برقم هذا الموبايل',
    auth_wrong_password: 'كلمة السر غير صحيحة'
  }
  const basket = []
  const initState = {sections, randomColors, categories, locations, countries, units, labels, 
                    orderStatus, basket, trademarks, orderByList, stores, storeTypes, orderUnitTypes}

  const [state, dispatch] = useReducer(Reducer, initState)
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [rating, setRating] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newStores, setNewStores] = useState([]);
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setUser(user)
      if (user){
        firebase.firestore().collection('orders').onSnapshot(docs => {
          let ordersArray = []
          docs.forEach(doc => {
            ordersArray.push({...doc.data(), id:doc.id})
          })
          setOrders(ordersArray)
        })  
        firebase.firestore().collection('stores').onSnapshot(docs => {
          let storesArray = []
          docs.forEach(doc => {
            storesArray.push({...doc.data(), id:doc.id})
          })
          setNewStores(storesArray)
        })  
      }
    });
    firebase.firestore().collection('products').onSnapshot(docs => {
      let productsArray = []
      docs.forEach(doc => {
        productsArray.push({...doc.data(), id: doc.id})
      })
      setProducts(productsArray)
    })
    firebase.firestore().collection('rating').onSnapshot(docs => {
      let ratingArray = []
      docs.forEach(doc => {
        ratingArray.push({...doc.data(), id: doc.id})
      })
      setRating(ratingArray)
    })
  }, []);
  return (
    <StoreContext.Provider value={{state, user, products, rating, orders, newStores, dispatch}}>
      {props.children}
    </StoreContext.Provider>
  );
}
 
export default Store;
