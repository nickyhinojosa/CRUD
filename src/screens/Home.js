import * as React from "react";
import * as RN from "react-native";
import { useNavigation } from "@react-navigation/native";
import { database } from "../../config/fb";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Product from "../components/Product";

export default function Home() {
  const [products, setProducts] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [filteredProducts, setFilteredProducts] = React.useState([]);
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <RN.Button title="Agregar" onPress={() => navigation.navigate("Add")} />
      ),
    });
  }, [navigation]);

  React.useEffect(() => {
    const collectionRef = collection(database, "products");
    const q = query(collectionRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        emoji: doc.data().emoji,
        name: doc.data().name,
        price: doc.data().price,
        isSold: doc.data().isSold,
        createdAt: doc.data().createdAt,
      }));
      setProducts(productsData);
      setFilteredProducts(productsData);  // Actualiza ambos estados
    });
    return unsubscribe; 
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const filteredData = products.filter((product) =>
        product.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProducts(filteredData);
    } else {
      setFilteredProducts(products);
    }
  };

  return (
    <RN.View style={styles.container}>
      <RN.Text style={styles.title}>Productos</RN.Text>
      <RN.TextInput
        style={styles.searchInput}
        placeholder="Buscar por nombre..."
        value={search}
        onChangeText={handleSearch}
      />
      <RN.ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {filteredProducts.map((product) => (
          <Product key={product.id} {...product} />
        ))}
      </RN.ScrollView>
    </RN.View>
  );
}

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F3F9",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    margin: 16,
  },
  searchInput: {
    width: "90%",
    alignSelf: "center",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
});
