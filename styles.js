import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:'#F2E8CF',
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
    buttonHome:{
        backgroundColor: '#809BCE',
        width: '70%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#293241',
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
        color: '#EE6C4D',
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
  })

  export default styles;