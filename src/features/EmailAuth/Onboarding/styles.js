import {StyleSheet, Dimensions} from 'react-native';
import {scaleModerate} from '../../../utils/scale';

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
    marginBottom: scaleModerate(154),
    width: '100%',
  },
  title: {
    fontSize: scaleModerate(24),
    letterSpacing: 0,
    color: '#fff',
    width: '100%',
    fontFamily: 'Nunito-Bold',
  },
  text: {
    fontSize: scaleModerate(20),
    letterSpacing: 0,
    fontFamily: 'Nunito-Regular',
    lineHeight: scaleModerate(32),
    color: '#fff',
    marginTop: scaleModerate(15)
  },
  absolute: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  buttonContainer: {
    width: scaleModerate(181),
    height: scaleModerate(129),
    position: 'absolute',
    bottom: 0,
    right: 0
  },
  circleBG: {
    width: scaleModerate(181) * 4,
    height: scaleModerate(129) * 4,
    top: 0,
    left: -40,
    position: 'absolute',
    backgroundColor: '#222222',
    borderRadius: scaleModerate(181) * 2,
  },
  paginationContainer: {
    position: 'absolute',
    left: scaleModerate(20),
    bottom: scaleModerate(106),
    flexDirection: 'row',
  },
  pagination: {
    width: scaleModerate(8),
    height: scaleModerate(8),
    backgroundColor: '#333333',
    borderRadius: scaleModerate(4),
    marginRight: scaleModerate(5),
  },
  paginationActive: {
    width: scaleModerate(24),
    backgroundColor: '#b88646',
  },
  introImage1: {
    width: scaleModerate(414),
    height: scaleModerate(548),
  },
  introImage2: {
    width: scaleModerate(414),
    height: scaleModerate(434),
    marginTop: scaleModerate(134),
  },
  introImage3: {
    width: scaleModerate(414),
    height: scaleModerate(434),
    marginTop: scaleModerate(108),
  },
  button: {
    width: scaleModerate(110),
    height: scaleModerate(30),
    borderRadius: scaleModerate(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b88746',
    marginTop: scaleModerate(70),
    marginLeft: scaleModerate(56),
  },
  buttonText: {
    fontSize: scaleModerate(14),
    fontFamily: 'Nunito-Bold'
  }
});

export default styles;
