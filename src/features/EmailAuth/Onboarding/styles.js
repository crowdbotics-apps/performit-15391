import {StyleSheet, Dimensions} from 'react-native';
import {scaleVertical} from '../../../utils/scale';

const size = new Dimensions('window');
const styles = StyleSheet.create({
  container: {
    width: size.width,
    height: size.height,
    backgroundColor: '#000',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  body: {
    paddingHorizontal: 20,
    marginBottom: scaleVertical(154),
    width: '100%',
  },
  title: {
    fontSize: scaleVertical(24),
    letterSpacing: 0,
    color: '#fff',
    width: '100%',
    fontFamily: 'Nunito-Bold',
  },
  text: {
    fontSize: scaleVertical(20),
    letterSpacing: 0,
    fontFamily: 'Nunito-Regular',
    lineHeight: scaleVertical(32),
    color: '#fff',
    marginTop: scaleVertical(15)
  },
  absolute: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  buttonContainer: {
    width: scaleVertical(181),
    height: scaleVertical(129),
    position: 'absolute',
    bottom: 0,
    right: 0
  },
  circleBG: {
    width: scaleVertical(181) * 4,
    height: scaleVertical(129) * 4,
    top: 0,
    left: -40,
    position: 'absolute',
    backgroundColor: '#222222',
    borderRadius: scaleVertical(181) * 2,
  },
  paginationContainer: {
    position: 'absolute',
    left: scaleVertical(20),
    bottom: scaleVertical(106),
    flexDirection: 'row',
  },
  pagination: {
    width: scaleVertical(8),
    height: scaleVertical(8),
    backgroundColor: '#333333',
    borderRadius: scaleVertical(4),
    marginRight: scaleVertical(5),
  },
  paginationActive: {
    width: scaleVertical(24),
    backgroundColor: '#b88646',
  },
  introImage1: {
    width: '100%',
    height: scaleVertical(548),
  },
  introImage2: {
    width:'100%',
    height: scaleVertical(434),
    marginTop: scaleVertical(134),
  },
  introImage3: {
    width: scaleVertical(414),
    height: scaleVertical(434),
    marginTop: scaleVertical(108),
  },
  button: {
    width: scaleVertical(110),
    height: scaleVertical(30),
    borderRadius: scaleVertical(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b88746',
    marginTop: scaleVertical(70),
    marginLeft: scaleVertical(56),
  },
  buttonText: {
    fontSize: scaleVertical(14),
    fontFamily: 'Nunito-Bold'
  }
});

export default styles;
