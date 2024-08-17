import * as React from 'react';
import * as RN from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { database } from '../../config/fb';
import { useNavigation } from '@react-navigation/native';
import EmojiPicker from 'rn-emoji-keyboard';

export default function Edit({ route }) {
    const { id, emoji, name, price, isSold } = route.params;
    const [newEmoji, setNewEmoji] = React.useState(emoji);
    const [newName, setNewName] = React.useState(name);
    const [newPrice, setNewPrice] = React.useState(price);
    const [isOpen, setIsOpen] = React.useState(false);
    const navigation = useNavigation();

    const handlePick = (emojiObject) => {
        setNewEmoji(emojiObject.emoji);
    };

    const onSave = async () => {
        const productRef = doc(database, "products", id);
        await updateDoc(productRef, {
            emoji: newEmoji,
            name: newName,
            price: Number(newPrice),
            isSold: isSold,
        });
        navigation.goBack();
    };

    return (
        <RN.View style={styles.container}>
            <RN.Text style={styles.title}>Editar Producto</RN.Text>
            <RN.Text onPress={() => setIsOpen(true)} style={styles.emoji}>
                {newEmoji}
            </RN.Text>
            <EmojiPicker
                onEmojiSelected={handlePick}
                open={isOpen}
                onClose={() => setIsOpen(false)}
            />
            <RN.TextInput
                style={styles.input}
                value={newName}
                onChangeText={setNewName}
                placeholder="Nombre del Producto"
            />
            <RN.TextInput
                style={styles.input}
                value={String(newPrice)}
                onChangeText={setNewPrice}
                placeholder="Precio"
                keyboardType="numeric"
                
            />
            <RN.TouchableOpacity style={styles.saveButton} onPress={onSave}>
                <RN.Text style={styles.saveButtonText}>Guardar</RN.Text>
            </RN.TouchableOpacity>
        </RN.View>
    );
}

const styles = RN.StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f7f7f7',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        width: '90%',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 13,
        marginVertical: 6,
        borderRadius: 6,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    emoji: {
        fontSize: 100,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        padding: 10,
        marginVertical: 6,
    },
    saveButton: {
        backgroundColor: '#0FA5E9',
        padding: 15,
        marginTop: 20,
        borderRadius: 8,
        alignItems: 'center',
        width: '90%',
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});
