import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:'#f1f8ff',
    },
    containerSalary:{
        flex:1,
        padding:16,
        paddingTop:30,
        backgroundColor:'#F2E8CF',
    },
    inputContainer: {
      width: '80%',
    },
    input: {
      backgroundColor: '#fff',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      marginTop: 5,
      borderColor: '#EAE0C8',
      borderWidth: 2,
    },
    inputCreate: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: 'white',
      },
    buttonContainer: {
      width: '60%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 40,
    },
    buttonContainerSalary: {
        flexDirection: 'row',
        marginLeft: 10,
    },
    button: {
      backgroundColor: '#EE6C4D',
      width: '80%',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#EAE0C8',
      marginTop:10,
    },
    buttonCreate: {
        backgroundColor: '#EE6C4D',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#EAE0C8',
        marginTop:10,
      },
    buttonHome:{
        backgroundColor: '#EE6C4D',
        width: '70%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#EAE0C8',
        marginTop: 15,
    },
    buttonText: {
      color: '#E0FBFC',
      fontWeight: '700',
      fontSize: 16,
    },
  
    buttonOutline: {
      backgroundColor: 'white',
      marginTop: 5,
      borderColor: '#EAE0C8',
      borderWidth: 2,
    },
    
    buttonOutlineText: {
      color: '#F17105',
      fontWeight: '700',
      fontSize: 16,
    },

    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
     },
     greeting: {
        fontSize: 20,
        marginBottom: 20,
        fontWeight: 'bold',
        color: 'black',
      },
    head: { height: 40, backgroundColor: '#809BCE' },
    text: { margin: 6, color: '#333' },
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
    },

    disabledButton: {
        backgroundColor: '#a0a0a0', // Use a different color for the disabled state
      },
    iconButton: {
        position: 'absolute',
        top: 60,
        right: 20,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#F2D0A4',
      },
    textStyle: {
        fontSize:25,
        padding:10,
        color:'#809BCE',
        marginBottom:50,
    },
    textStylee: {
        fontSize:25,
        padding:10,
        color:'#809BCE',
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        resizeMode: 'cover',
      },
      overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      card: {
        backgroundColor: '#F2E8CF',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        elevation: 3,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: 'black',
      },
      picker: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginVertical: 10,
        borderRadius: 5,
        backgroundColor: 'white',
      },
      label: {
        fontSize: 16,
        marginVertical: 10,
        color: 'black',
      },
  })

  export default styles;