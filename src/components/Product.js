import * as React from 'react';
import * as RN from 'react-native';
import { database } from '../../config/fb';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Product({
    id,
    emoji,
    name,
    price,
    isSold,
}) {
    const [sold, setSold] = React.useState(isSold);
    const navigation = useNavigation();

    const onDelete = () => {
        const docRef = doc(database, 'products', id);
        deleteDoc(docRef);
    }

    const onEdit = () => {
        navigation.navigate('Edit', { id, emoji, name, price, isSold: sold });
    }

    const onBuy = async () => {
        const docRef = doc(database, 'products', id);
        await updateDoc(docRef, {
            isSold: true,
        });
        setSold(true);
    }

    return(
        <RN.View>
            <RN.View style={styles.productContainer}>
                <RN.View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <RN.Text style={styles.emoji}>{emoji}</RN.Text>
                    <RN.View style={{flexDirection: 'row'}}>
                        <AntDesign onPress={onDelete} name="delete" size={24} color="black" />
                        <AntDesign onPress={onEdit} name="edit" size={24} color="black" style={{ marginLeft: 10 }} />
                    </RN.View>
                </RN.View>
                <RN.Text style={styles.name}>{name}</RN.Text>
                <RN.Text style={styles.price}>Bs.{price}</RN.Text>
                {sold ? (
                    <RN.TouchableOpacity 
                        style={[styles.button, {backgroundColor: 'gray'}]}>
                        <RN.Text style={styles.buttonText}>Vendido</RN.Text>
                    </RN.TouchableOpacity>
                ) : (
                    <RN.TouchableOpacity 
                        onPress={onBuy}
                        style={styles.button}>
                        <RN.Text style={styles.buttonText}>Comprar</RN.Text>
                    </RN.TouchableOpacity>
                )}
            </RN.View>
        </RN.View>
    )
}

const styles = RN.StyleSheet.create({
    productContainer: {
        padding: 16,
        backgroundColor: '#fff',
        margin: 16,
        borderRadius: 8,
    },
    emoji: {
        fontSize: 100,
    },
    name: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'gray',
    },
    button: {
        backgroundColor: '#0FA5E9',
        padding: 10,
        marginVertical: 6,
        borderRadius: 8,
        alignItems: 'center'
   },
    buttonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
});
