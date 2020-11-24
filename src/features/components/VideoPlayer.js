import React, {Component} from 'react';
import Video from 'react-native-video';
import {
  TouchableWithoutFeedback,
  TouchableHighlight,
  TouchableOpacity,
  ImageBackground,
  PanResponder,
  StyleSheet,
  Animated,
  Easing,
  View,
  Text,
  Dimensions,
  BackHandler,
} from 'react-native';
import {padStart} from 'lodash';
import VideoPlayIcon from '../../assets/images/video_play_icon';
import VideoPauseIcon from '../../assets/images/video_pause_icon';
import {scaleModerate} from '../../utils/scale';

const screenHeight = Dimensions.get('window').height;

export default class VideoPlayer extends Component {
  static defaultProps = {
    toggleResizeModeOnFullscreen: true,
    playInBackground: false,
    playWhenInactive: false,
    showOnStart: true,
    resizeMode: 'cover',
    paused: true,
    repeat: false,
    volume: 1,
    muted: false,
    title: '',
    rate: 1,
    seekerWidth: scaleModerate(0),
    subtitleText: [],
    navigation: '',
    shouldToggleControls: true,
  };

  constructor(props) {
    super(props);

    /**
     * All of our values that are updated by the
     * methods and listeners in this class
     */
    this.state = {
      // Video
      resizeMode: this.props.resizeMode,
      paused: this.props.paused,
      muted: this.props.muted,
      volume: this.props.volume,
      rate: this.props.rate,
      subtitleLink: this.props.subtitleLink,
      videoThumbnail: this.props.videoThumbnail,
      selectedLearningObjective: this.props.selectedLearningObjective,
      selectedLOStartTime: this.props.selectedLOStartTime,
      selectedLOEndTime: this.props.selectedLOEndTime,
      subtitleText: this.props.subtitleText,
      navigation: this.props.navigation,
      seekBarMinPosition: 0,
      seekBarMaxPosition: 0,
      // Controls

      isFullscreen: false,
      showTimeRemaining: true,
      volumeTrackWidth: 0,
      lastScreenPress: 0,
      volumeFillWidth: 0,
      seekerFillWidth: 0,
      showControls: this.props.showOnStart,
      volumePosition: 0,
      seekerPosition: 0,
      volumeOffset: 0,
      seekerOffset: 0,
      seekerPositionOnStart: 0,
      seeking: false,
      loading: false,
      currentTime: 0,
      error: false,
      duration: 0,
      seekLoading: false,
      showSubtitle: true,
      videoHeight: scaleModerate(this.props.videoHeight || 350),
      source: '',
      isSourcePresent: false,
      showPoster: true,
      currentSubtitleText: '',
    };

    /**
     * Any options that can be set at init.
     */
    this.opts = {
      playWhenInactive: this.props.playWhenInactive,
      playInBackground: this.props.playInBackground,
      repeat: this.props.repeat,
      title: this.props.title,
    };

    /**
     * Our app listeners and associated methods
     */
    this.events = {
      onError: this.props.onError || this._onError.bind(this),
      onBack: this.props.onBack || this._onBack.bind(this),
      onEnd: this.props.onEnd || this._onEnd.bind(this),
      onScreenTouch: this._onScreenTouch.bind(this),
      onEnterFullscreen: this.props.onEnterFullscreen,
      onExitFullscreen: this.props.onExitFullscreen,
      onLoadStart: this._onLoadStart.bind(this),
      onProgress: this._onProgress.bind(this),
      onLoad: this._onLoad.bind(this),
      onPause: this.props.onPause,
      onPlay: this.props.onPlay,
    };

    /**
     * Functions used throughout the application
     */
    this.methods = {
      toggleFullscreen: this._toggleFullscreen.bind(this),
      togglePlayPause: this._togglePlayPause.bind(this),
      moveVideoBackward: this._moveVideoBackward.bind(this),
      moveVideoForward: this._moveVideoForward.bind(this),
      toggleControls: this._toggleControls.bind(this),
      toggleTimer: this._toggleTimer.bind(this),
    };

    /**
     * Player information
     */
    this.player = {
      controlTimeoutDelay: this.props.controlTimeout || 7000,
      volumePanResponder: PanResponder,
      seekPanResponder: PanResponder,
      controlTimeout: null,
      volumeWidth: 150,
      iconOffset: 0,
      seekerWidth: 0,
      ref: `video${this.props.postId}`,
    };

    /**
     * Various animations
     */
    const initialValue = this.props.showOnStart ? 1 : 0;

    this.animations = {
      bottomControl: {
        marginBottom: new Animated.Value(0),
        opacity: new Animated.Value(initialValue),
      },
      topControl: {
        marginTop: new Animated.Value(0),
        opacity: new Animated.Value(initialValue),
      },
      video: {
        opacity: new Animated.Value(1),
      },
      loader: {
        rotate: new Animated.Value(0),
        MAX_VALUE: 360,
      },
    };

    /**
     * Various styles that be added...
     */
    this.styles = {
      videoStyle: this.props.videoStyle || {},
      containerStyle: this.props.style || {},
    };
  }

  /**
     | -------------------------------------------------------
     | Events
     | -------------------------------------------------------
     |
     | These are the events that the <Video> component uses
     | and can be overridden by assigning it as a prop.
     | It is suggested that you override onEnd.
     |
     */

  /**
   * When load starts we display a loading icon
   * and show the controls.
   */
  _onLoadStart() {
    const state = this.state;
    state.loading = true;
    this.loadAnimation();
    this.setState(state);

    if (typeof this.props.onLoadStart === 'function') {
      this.props.onLoadStart(...arguments);
    }
  }

  /**
   * When load is finished we hide the load icon
   * and hide the controls. We also set the
   * video duration.
   *
   * @param {object} data The video meta data
   */
  _onLoad(data = {}) {
    const state = this.state;
    state.duration = data.duration;
    state.seekBarMaxPosition = this.player.seekerWidth;
    state.loading = false;
    this.setState(state);
    if (state.showControls) {
      this.setControlTimeout();
    }

    if (typeof this.props.onLoad === 'function') {
      this.props.onLoad(...arguments);
    }
  }

  /**
   * For onprogress we fire listeners that
   * update our seekbar and timer.
   *
   * @param {object} data The video meta data
   */
  _onProgress(data = {}) {
    const state = this.state;
    state.currentTime = state.seekLoading
      ? state.currentTime
      : data.currentTime;
    this.props.onVideoProgress(state.currentTime);
    if (!state.seeking && !state.paused) {
      const position = this.calculateSeekerPosition();
      this.setSeekerPosition(position);
    }

    if (typeof this.props.onProgress === 'function') {
      this.props.onProgress(...arguments);
    }

    this.setState(state);
  }

  /**
   * It is suggested that you override this
   * command so your app knows what to do.
   * Either close the video or go to a
   * new page.
   */
  _onEnd() {
    const state = this.state;
    this.setState(state);
  }

  /**
   * Set the error state to true which then
   * changes our renderError function
   *
   * @param {object} err  Err obj returned from <Video> component
   */
  _onError() {
    const state = this.state;
    state.error = true;
    state.loading = false;

    this.setState(state);
  }

  /**
   * This is a single and double tap listener
   * when the user taps the screen anywhere.
   * One tap toggles controls, two toggles
   * fullscreen mode.
   */
  _onScreenTouch() {
    const state = this.state;
    const time = new Date().getTime();
    // const delta = time - state.lastScreenPress;

    // if (delta < 300) {
    //   this.methods.toggleFullscreen();
    // }

    this.methods.toggleControls();
    state.lastScreenPress = time;

    this.setState(state);
  }

  /**
     | -------------------------------------------------------
     | Methods
     | -------------------------------------------------------
     |
     | These are all of our functions that interact with
     | various parts of the class. Anything from
     | calculating time remaining in a video
     | to handling control operations.
     |
     */

  /**
   * Set a timeout when the controls are shown
   * that hides them after a length of time.
   * Default is 15s
   */
  setControlTimeout() {
    this.player.controlTimeout = setTimeout(() => {
      this.props.shouldToggleControls && this._hideControls();
    }, this.player.controlTimeoutDelay);
  }

  /**
   * Clear the hide controls timeout.
   */
  clearControlTimeout() {
    clearTimeout(this.player.controlTimeout);
  }

  /**
   * Reset the timer completely
   */
  resetControlTimeout() {
    this.clearControlTimeout();
    this.setControlTimeout();
  }

  /**
   * Animation to hide controls. We fade the
   * display to 0 then move them off the
   * screen so they're not interactable
   */
  hideControlAnimation() {
    Animated.parallel([
      Animated.timing(this.animations.topControl.opacity, {toValue: 0}),
      Animated.timing(this.animations.topControl.marginTop, {toValue: 0}),
      Animated.timing(this.animations.bottomControl.opacity, {toValue: 0}),
      Animated.timing(this.animations.bottomControl.marginBottom, {
        toValue: 0,
      }),
    ]).start();
  }

  /**
   * Animation to show controls...opposite of
   * above...move onto the screen and then
   * fade in.
   */
  showControlAnimation() {
    Animated.parallel([
      Animated.timing(this.animations.topControl.opacity, {toValue: 1}),
      Animated.timing(this.animations.topControl.marginTop, {toValue: 0}),
      Animated.timing(this.animations.bottomControl.opacity, {toValue: 1}),
      Animated.timing(this.animations.bottomControl.marginBottom, {
        toValue: 0,
      }),
    ]).start();
  }

  /**
   * Loop animation to spin loader icon. If not loading then stop loop.
   */
  loadAnimation() {
    if (this.state.loading) {
      Animated.sequence([
        Animated.timing(this.animations.loader.rotate, {
          toValue: this.animations.loader.MAX_VALUE,
          duration: 1500,
          easing: Easing.linear,
        }),
        Animated.timing(this.animations.loader.rotate, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
        }),
      ]).start(this.loadAnimation.bind(this));
    }
  }

  /**
   * Function to hide the controls. Sets our
   * state then calls the animation.
   */
  _hideControls() {
    if (this.mounted && this.props.shouldToggleControls) {
      const state = this.state;
      state.showControls = false;
      this.props.showControls(state.showControls);
      this.hideControlAnimation();

      this.setState(state);
    } else {
      this.props.showControls(this.state.showControls);
    }
  }

  /**
   * Function to toggle controls based on
   * current state.
   */
  _toggleControls() {
    if (this.props.shouldToggleControls) {
      this.clearControlTimeout();
      const state = this.state;
      state.showControls = !state.showControls;
      this.props.showControls(state.showControls);
      if (state.showControls) {
        this.showControlAnimation();
        this.setControlTimeout();
      } else {
        this.hideControlAnimation();
      }

      this.setState(state);
    } else {
      this.props.showControls(this.state.showControls);
    }
  }

  /**
   * Toggle fullscreen changes resizeMode on
   * the <Video> component then updates the
   * isFullscreen state.
   */
  _toggleFullscreen() {
    const state = this.state;

    state.isFullscreen = !state.isFullscreen;
    state.resizeMode = state.isFullscreen === true ? 'contain' : 'cover';
    if (state.isFullscreen) {
      typeof this.events.onEnterFullscreen === 'function' &&
        this.events.onEnterFullscreen();
    } else {
      typeof this.events.onExitFullscreen === 'function' &&
        this.events.onExitFullscreen();
    }
    this.setState(state);
  }

  /**
   * Toggle playing state on <Video> component
   */
  _togglePlayPause() {
    const state = this.state;
    state.paused = !state.paused;
    if (state.paused) {
      typeof this.events.onPause === 'function' && this.events.onPause();
    } else {
      typeof this.events.onPlay === 'function' && this.events.onPlay();
    }
    this.setState(state);
  }

  /**
   * Move video back by time specified in sec
   */
  _moveVideoBackward(time = 10) {
    let seekTime;
    if (
      this.state.selectedLearningObjective !== 'none' &&
      this.state.selectedLearningObjective !== 'revisit'
    ) {
      seekTime = this.state.selectedLOStartTime / 1000;
      if (
        this.state.currentTime - this.state.selectedLOStartTime / 1000 >
        time
      ) {
        seekTime = this.state.currentTime - time;
      }
    } else {
      seekTime = 0;
      if (this.state.currentTime > time) {
        seekTime = this.state.currentTime - time;
      }
    }
    this.seekTo(seekTime);
    const percent = seekTime / this.state.duration;
    this.setSeekerPosition(
      (this.player.seekerWidth - this.props.seekerWidth) * percent,
    );
  }

  /**
   * Move video forward by time specified in sec
   */
  _moveVideoForward(time = 10) {
    let seekTime;
    if (
      this.state.selectedLearningObjective !== 'none' &&
      this.state.selectedLearningObjective !== 'revisit'
    ) {
      seekTime = this.state.selectedLOEndTime / 1000;
      if (this.state.selectedLOEndTime / 1000 - this.state.currentTime > time) {
        seekTime = this.state.currentTime + time;
      }
    } else {
      seekTime = this.state.duration;
      if (this.state.duration - this.state.currentTime > time) {
        seekTime = this.state.currentTime + time;
      }
    }
    this.seekTo(seekTime);
    const percent = seekTime / this.state.duration;
    this.setSeekerPosition(
      (this.player.seekerWidth - this.props.seekerWidth) * percent,
    );
  }

  /**
   * Toggle between showing time remaining or
   * video duration in the timer control
   */
  _toggleTimer() {
    const state = this.state;
    state.showTimeRemaining = !state.showTimeRemaining;
    this.setState(state);
  }

  /**
   * The default 'onBack' function pops the navigator
   * and as such the video player requires a
   * navigator prop by default.
   */
  _onBack() {
    if (this.props.navigator && this.props.navigator.pop) {
      this.props.navigator.pop();
    } else {
      console.warn(
        'Warning: _onBack requires navigator property to function. Either modify the onBack prop or pass a navigator prop',
      );
    }
  }

  /**
   * Calculate the time to show in the timer area
   * based on if they want to see time remaining
   * or duration. Formatted to look as 00:00.
   */
  calculateTime() {
    if (this.state.showTimeRemaining) {
      const time = this.state.duration - this.state.currentTime;
      return `-${this.formatTime(time)}`;
    }

    return this.formatTime(this.state.currentTime);
  }

  /**
   * Return current time of the video.
   * Formatted to look as 00:00.
   */
  showCurrentTime() {
    return this.formatTime(this.state.currentTime);
  }

  /**
   * Return total duration of the video.
   * Formatted to look as 00:00.
   */
  showTotalDuration() {
    return this.formatTime(this.state.duration);
  }

  /**
   * Format a time string as mm:ss
   *
   * @param {int} time time in milliseconds
   * @return {string} formatted time string in mm:ss format
   */
  formatTime(time = 0) {
    const symbol = this.state.showRemainingTime ? '-' : '';
    time = Math.min(Math.max(time, 0), this.state.duration);

    const formattedMinutes = padStart(Math.floor(time / 60).toFixed(0), 2, 0);
    const formattedSeconds = padStart(Math.floor(time % 60).toFixed(0), 2, 0);

    return `${symbol}${formattedMinutes}:${formattedSeconds}`;
  }

  /**
   * Set the position of the seekbar's components
   * (both fill and handle) according to the
   * position supplied.
   *
   * @param {float} position position in px of seeker handle}
   */
  setSeekerPosition(position = 0) {
    const state = this.state;
    position = this.constrainToSeekerMinMax(position);
    state.seekerFillWidth = position;
    state.seekerPosition = position;
    if (!state.seeking) {
      state.seekerOffset = position;
    }

    this.setState(state);
  }

  /**
   * Contrain the location of the seeker to the
   * min/max value based on how big the
   * seeker is.
   *
   * @param {float} val position of seeker handle in px
   * @return {float} contrained position of seeker handle in px
   */
  constrainToSeekerMinMax(val = 0) {
    if (
      this.state.selectedLearningObjective !== 'none' &&
      this.state.selectedLearningObjective !== 'revisit'
    ) {
      if (val <= this.state.seekBarMinPosition) {
        return this.state.seekBarMinPosition;
      } else if (val >= this.state.seekBarMaxPosition) {
        return this.state.seekBarMaxPosition;
      }
    } else {
      if (val <= 0) {
        return 0;
      } else if (val >= this.player.seekerWidth - this.props.seekerWidth) {
        return this.player.seekerWidth - this.props.seekerWidth;
      }
    }
    return val;
  }

  /**
   * Calculate the position that the seeker should be
   * at along its track.
   *
   * @return {float} position of seeker handle in px based on currentTime
   */
  calculateSeekerPosition() {
    if (this.state.currentTime === 0) {
      return 0;
    }
    const percent = this.state.currentTime / this.state.duration;
    return (this.player.seekerWidth - this.props.seekerWidth) * percent;
  }

  /**
   * Return the time that the video should be at
   * based on where the seeker handle is.
   *
   * @return {float} time in ms based on seekerPosition.
   */
  calculateTimeFromSeekerPosition() {
    const percent =
      this.state.seekerPosition /
      (this.player.seekerWidth - this.props.seekerWidth);
    return this.state.duration * percent;
  }

  /**
   * Seek to a time in the video.
   *
   * @param {float} time time to seek to in ms
   */
  seekTo(time = 0) {
    this.clearControlTimeout();
    const state = this.state;
    state.currentTime = time;
    state.seekLoading = true;
    this.player.ref.seek(time);
    this.setState(state);
    this.props.initializeSeek();
  }

  /**
   * Set the position of the volume slider
   *
   * @param {float} position position of the volume handle in px
   */
  setVolumePosition(position = 0) {
    const state = this.state;
    position = this.constrainToVolumeMinMax(position);
    state.volumePosition = position + this.player.iconOffset;
    state.volumeFillWidth = position;

    state.volumeTrackWidth = this.player.volumeWidth - state.volumeFillWidth;

    if (state.volumeFillWidth < 0) {
      state.volumeFillWidth = 0;
    }

    if (state.volumeTrackWidth > 150) {
      state.volumeTrackWidth = 150;
    }

    this.setState(state);
  }

  /**
   * Constrain the volume bar to the min/max of
   * its track's width.
   *
   * @param {float} val position of the volume handle in px
   * @return {float} contrained position of the volume handle in px
   */
  constrainToVolumeMinMax(val = 0) {
    if (val <= 0) {
      return 0;
    } else if (val >= this.player.volumeWidth + 9) {
      return this.player.volumeWidth + 9;
    }
    return val;
  }

  /**
   * Get the volume based on the position of the
   * volume object.
   *
   * @return {float} volume level based on volume handle position
   */
  calculateVolumeFromVolumePosition() {
    return this.state.volumePosition / this.player.volumeWidth;
  }

  /**
   * Get the position of the volume handle based
   * on the volume
   *
   * @return {float} volume handle position in px based on volume
   */
  calculateVolumePositionFromVolume() {
    return this.player.volumeWidth * this.state.volume;
  }

  /**
     | -------------------------------------------------------
     | React Component functions
     | -------------------------------------------------------
     |
     | Here we're initializing our listeners and getting
     | the component ready using the built-in React
     | Component methods
     |
     */

  /**
   * Before mounting, init our seekbar and volume bar
   * pan responders.
   */
  UNSAFE_componentWillMount() {
    // adding event to unmount video when user navigates to other page
    this.blurSubscription = this.state.navigation.addListener(
      'willBlur',
      () => {
        if (!this.state.paused) {
          this.methods.togglePlayPause();
        }
      },
    );
    this.initSeekPanResponder();
    this.initVolumePanResponder();
  }

  /**
   * To allow basic playback management from the outside
   * we have to handle possible props changes to state changes
   */
  componentWillReceiveProps(nextProps) {
    const state = this.state;
    if (this.state.paused !== nextProps.paused) {
      this.setState({
        paused: nextProps.paused,
      });
    }

    this.setState({
      seekBarMinPosition: 0,
    });
    this.setState({
      seekBarMaxPosition: this.player.seekerWidth,
    });

    if (nextProps.source && !state.source) {
      this.setState({
        source: nextProps.source,
      });
      this.setState({
        isSourcePresent: true,
      });
    }

    if (nextProps.seekTime > -1) {
      this.setState({
        seekTime: nextProps.seekTime,
      });
      const percent = nextProps.seekTime / this.state.duration;
      this.setSeekerPosition(
        (this.player.seekerWidth - this.props.seekerWidth) * percent,
      );
      this.seekTo(nextProps.seekTime);
    }
  }

  /**
   * Upon mounting, calculate the position of the volume
   * bar based on the volume property supplied to it.
   */
  componentDidMount() {
    const position = this.calculateVolumePositionFromVolume();
    const state = this.state;
    this.setVolumePosition(position);
    state.volumeOffset = position;
    this.mounted = true;
    const {width} = Dimensions.get('window');
    // state.videoHeight = 0.633 * width;
    this.setState(state);
    // handle hardware back button press on android
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  }

  /**
   *
   * When the component is about to unmount kill the
   * timeout less it fire in the prev/next scene
   */
  componentWillUnmount() {
    this.mounted = false;
    this.clearControlTimeout();
    this.backHandler && this.backHandler.remove();
    this.blurSubscription && this.blurSubscription.remove();
  }

  // handling android hardware back button click
  handleBackPress = () => {
    if (this.state.isFullscreen) {
      this.methods.toggleFullscreen();
    } else {
      this.state.navigation.goBack();
    }
    return true;
  };

  onSeekBarRelease() {
    let time = this.calculateTimeFromSeekerPosition();
    const state = this.state;
    if (time >= state.duration && !state.loading) {
      state.paused = true;
      this.events.onEnd();
      time = state.duration - 0.05;
    } else {
      this.setControlTimeout();
      state.seeking = false;
    }
    this.seekTo(time);
    this.setState(state);
  }

  /**
   * Get our seekbar responder going
   */
  initSeekPanResponder() {
    this.clearControlTimeout();
    this.player.seekPanResponder = PanResponder.create({
      // Ask to be the responder.
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,

      /**
       * When we start the pan tell the machine that we're
       * seeking. This stops it from updating the seekbar
       * position in the onProgress listener.
       */
      onPanResponderGrant: (evt, gestureState) => {
        const state = this.state;
        state.seekerPositionOnStart = this.state.seekerPosition;
        this.clearControlTimeout();
        state.seeking = true;
        this.setState(state);
        return true;
      },

      /**
       * When panning, update the seekbar position, duh.
       */
      onPanResponderMove: (evt, gestureState) => {
        const position = this.state.seekerPositionOnStart + gestureState.dx;
        this.setSeekerPosition(position);
        return true;
      },

      /**
       * On release we update the time and seek to it in the video.
       * If you seek to the end of the video we fire the
       * onEnd callback
       */
      onPanResponderRelease: (evt, gestureState) => {
        this.onSeekBarRelease();
        this.setState({
          seekerPositionOnStart: this.state.seekerPosition,
        });
        return true;
      },
    });
  }

  handleSeekBarPress = e => {
    if (this.state.showControls) {
      const state = this.state;
      if (
        this.state.selectedLearningObjective !== 'none' &&
        this.state.selectedLearningObjective !== 'revisit'
      ) {
        const position = e.nativeEvent.locationX;
        if (
          position >= this.state.seekBarMinPosition &&
          position <= this.state.seekBarMaxPosition
        ) {
          this.clearControlTimeout();
          const position = e.nativeEvent.locationX;
          this.setSeekerPosition(position);
          this.onSeekBarRelease();
        } else if (
          position >= this.state.seekBarMaxPosition &&
          position <= this.state.seekBarMaxPosition + this.props.seekerWidth
        ) {
          this.clearControlTimeout();
          this.setSeekerPosition(this.state.seekBarMaxPosition);
          this.onSeekBarRelease();
        }
      } else {
        this.clearControlTimeout();
        const position = e.nativeEvent.locationX;
        this.setSeekerPosition(position);
        this.onSeekBarRelease();
      }
      this.setState(state);
    }
  };

  showHiddenControls = () => {
    if (this.state.showControls === false) {
      this.setState({
        showControls: true,
      });
      this.props.showControls(this.state.showControls);
      this.showControlAnimation();
      this.setControlTimeout();
    }
  };

  /**
   * Toggle subtitle on click of cc button
   */
  toggleSubtitle = () => {
    this.setState({
      showSubtitle: !this.state.showSubtitle,
    });
  };

  /**
   * Initialize the volume pan responder.
   */
  initVolumePanResponder() {
    this.player.volumePanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.clearControlTimeout();
      },

      /**
       * Update the volume as we change the position.
       * If we go to 0 then turn on the mute prop
       * to avoid that weird static-y sound.
       */
      onPanResponderMove: (evt, gestureState) => {
        const state = this.state;
        const position = this.state.volumeOffset + gestureState.dx;

        this.setVolumePosition(position);
        state.volume = this.calculateVolumeFromVolumePosition();

        if (state.volume <= 0) {
          state.muted = true;
        } else {
          state.muted = false;
        }

        this.setState(state);
      },

      /**
       * Update the offset...
       */
      onPanResponderRelease: (evt, gestureState) => {
        const state = this.state;
        state.volumeOffset = state.volumePosition;
        this.setControlTimeout();
        this.setState(state);
      },
    });
  }

  /**
     | -------------------------------------------------------
     | Rendering
     | -------------------------------------------------------
     |
     | This section contains all of our render methods.
     | In addition to the typical React render func
     | we also have all the render methods for
     | the controls.
     |
     */

  /**
   * Standard render control function that handles
   * everything except the sliders. Adds a
   * consistent <TouchableHighlight>
   * wrapper and styling.
   */
  renderControl(children, callback, style = {}) {
    return (
      <TouchableHighlight
        hitSlop={{
          top: scaleModerate(10),
          bottom: scaleModerate(10),
          left: scaleModerate(10),
          right: scaleModerate(10),
        }}
        underlayColor="transparent"
        activeOpacity={0.3}
        onPress={() => {
          this.resetControlTimeout();
          callback();
        }}
        style={[styles.controls.control, style]}>
        {children}
      </TouchableHighlight>
    );
  }

  /**
   * Renders an empty control, used to disable a control without breaking the view layout.
   */
  renderNullControl() {
    return <View style={[styles.controls.control]} />;
  }

  /**
   * Groups the top bar controls together in an animated
   * view and spaces them out.
   */
  renderTopControls() {
    const volumeControl = this.props.disableVolume
      ? this.renderNullControl()
      : this.renderVolume();

    return (
      <Animated.View
        style={[
          styles.controls.top,
          {
            opacity: this.animations.topControl.opacity,
            marginTop: this.animations.topControl.marginTop,
          },
        ]}>
        {this.state.isFullscreen ? (
          <ImageBackground
            style={[styles.controls.column]}
            imageStyle={this.state.isFullscreen && [styles.controls.vignette]}>
            <View style={styles.controls.topControlGroup}>
              <View style={styles.controls.pullRight}>{volumeControl}</View>
            </View>
          </ImageBackground>
        ) : (
          <ImageBackground
            style={[styles.controls.column]}
            imageStyle={this.state.isFullscreen && [styles.controls.vignette]}>
            <View style={styles.controls.topControlGroup}>
              <View style={styles.controls.pullRight}>{volumeControl}</View>
            </View>
          </ImageBackground>
        )}
      </Animated.View>
    );
  }

  /**
   * Render the volume slider and attach the pan handlers
   */
  renderVolume() {
    return (
      <View style={styles.volume.container}>
        <View
          style={[styles.volume.fill, {width: this.state.volumeFillWidth}]}
        />
        <View
          style={[styles.volume.track, {width: this.state.volumeTrackWidth}]}
        />
        <View
          style={[styles.volume.handle, {left: this.state.volumePosition}]}
          {...this.player.volumePanResponder.panHandlers}
        />
      </View>
    );
  }

  /**
   * Render bottom control group and wrap it in a holder
   */
  renderBottomControls() {
    const seekbarControl = this.props.disableSeekbar
      ? this.renderNullControl()
      : this.renderSeekbar();

    return (
      <Animated.View
        style={[
          styles.controls.bottom,
          {
            opacity: this.animations.bottomControl.opacity,
            marginBottom: this.animations.bottomControl.marginBottom,
            width: '100%',
            position: 'absolute',
            bottom: 0,
            left: 0,
          },
        ]}>
        <TouchableWithoutFeedback onPress={this.showHiddenControls}>
          <ImageBackground style={[styles.controls.column]}>
            {seekbarControl}
          </ImageBackground>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }

  renderSubtitles() {
    return (
      <View
        style={[
          styles.controls.subtitleBox,
          !this.state.showControls && styles.controls.subtitleBoxPadding,
        ]}>
        <Text style={styles.controls.subtitleText}>
          {this.state.currentSubtitleText}
        </Text>
      </View>
    );
  }

  onSeekBarLayout = event => {
    const state = this.state;
    this.player.seekerWidth = event.nativeEvent.layout.width;
    if (state.selectedLOStartTime) {
      const minPercent =
        state.selectedLOStartTime / (this.state.duration * 1000);
      const minPosition =
        (this.player.seekerWidth - this.props.seekerWidth) * minPercent;
      state.seekBarMinPosition = minPosition;
    }
    if (state.selectedLOEndTime) {
      const maxPercent = state.selectedLOEndTime / (this.state.duration * 1000);
      const maxPosition =
        (this.player.seekerWidth - this.props.seekerWidth) * maxPercent;
      state.seekBarMaxPosition = maxPosition;
    }
    state.seekBarMaxPosition = this.player.seekerWidth;
    this.setState(state);
    if (!this.state.seeking && this.state.paused) {
      const position = this.calculateSeekerPosition();
      this.setSeekerPosition(position);
    }
  };

  /**
   * Render the seekbar and attach its handlers
   */
  renderSeekbar() {
    return (
      <TouchableWithoutFeedback onPressIn={this.handleSeekBarPress}>
        <View
          style={
            this.state.isFullscreen
              ? styles.seekbar.containerFS
              : styles.seekbar.container
          }>
          <View style={styles.seekbar.track} onLayout={this.onSeekBarLayout}>
            {this.state.selectedLearningObjective !== 'none' &&
              this.state.selectedLearningObjective !== 'revisit' && (
                <View
                  style={[
                    styles.seekbar.fill,
                    {
                      width:
                        this.state.seekBarMaxPosition -
                        this.state.seekBarMinPosition +
                        this.props.seekerWidth,
                      backgroundColor: '#d4d5d6',
                      left: this.state.seekBarMinPosition,
                    },
                  ]}
                />
              )}
            <View
              style={[
                styles.seekbar.fill,
                {
                  width: this.state.seekerFillWidth,
                  backgroundColor: this.props.seekColor || '#B88746',
                },
              ]}
            />
            <View
              style={[
                styles.seekbar.fill,
                {
                  width: this.state.seekBarMinPosition,
                  backgroundColor: '#707070',
                },
              ]}
            />
            <View
              style={[
                styles.seekbar.fill,
                {
                  width:
                    this.player.seekerWidth -
                    this.state.seekBarMaxPosition -
                    this.props.seekerWidth,
                  backgroundColor: '#707070',
                  left: this.state.seekBarMaxPosition + this.props.seekerWidth,
                },
              ]}
            />
          </View>
          <View
            style={[styles.seekbar.handle, {left: this.state.seekerPosition}]}
            {...this.player.seekPanResponder.panHandlers}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  /**
   * Render the play/pause button and show the respective icon
   */
  renderPlayPause() {
    return this.renderControl(
      <View style={styles.controls.pauseButton}>
        {this.state.paused === true ? <VideoPlayIcon /> : <VideoPauseIcon />}
      </View>,
      this.methods.togglePlayPause,
      styles.controls.playPause,
    );
  }

  /**
   * Show our timer.
   */
  renderTimer(time) {
    return this.renderControl(
      <Text style={styles.controls.timerText}>{time}</Text>,
      this.methods.toggleTimer,
      !this.state.isFullscreen && styles.controls.timer,
    );
  }

  /**
   * Show loading icon
   */
  renderLoader() {
    if (this.state.loading) {
      return (
        <View style={styles.loader.container}>
          <Animated.Image
            source={require('../../assets/images/loader_icon.png')}
            style={[
              styles.loader.icon,
              {
                transform: [
                  {
                    rotate: this.animations.loader.rotate.interpolate({
                      inputRange: [0, 360],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
      );
    }
    return null;
  }

  /**
   * Show play pause icon and functionality
   */
  renderPlayPauseControls() {
    const playPauseControl = this.props.disablePlayPause
      ? this.renderNullControl()
      : this.renderPlayPause();
    if (this.state.showControls && !this.state.loading) {
      return (
        <View style={styles.controls.playPausecontainer}>
          <View style={styles.controls.videoPlayIcon}>{playPauseControl}</View>
        </View>
      );
    }
    return null;
  }

  /**
   * Provide all of our options and render the whole component.
   */
  render() {
    return (
      <View
        style={[
          styles.player.parentContainer,
          {height: this.state.videoHeight},
        ]}>
        {this.state.isSourcePresent && (
          <TouchableWithoutFeedback
            onPress={this.events.onScreenTouch}
            style={[
              styles.player.container,
              this.styles.containerStyle,
              styles.player.videoBackground,
            ]}>
            <View
              style={[
                styles.player.container,
                this.styles.containerStyle,
                styles.player.videoBackground,
              ]}>
              <Video
                {...this.props}
                ref={videoPlayer => (this.player.ref = videoPlayer)}
                resizeMode={this.state.resizeMode}
                volume={this.state.volume}
                paused={this.state.paused}
                muted={this.state.muted}
                rate={this.state.rate}
                onLoadStart={this.events.onLoadStart}
                onProgress={this.events.onProgress}
                onError={this.events.onError}
                onLoad={this.events.onLoad}
                onEnd={this.events.onEnd}
                style={styles.player.video}
                source={{uri: this.state.source}}
                onSeek={() => {
                  this.setState({
                    seekLoading: false,
                  });
                }}
              />
              {this.renderLoader()}
              {this.renderPlayPauseControls()}
              {this.props.showBottomcontrol && this.renderBottomControls()}
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    );
  }
}

/**
 * This object houses our styles. There's player
 * specific styles and control specific ones.
 * And then there's volume/seeker styles.
 * width: '360@hs',
 * height: '202@hs'
 */
const styles = {
  player: StyleSheet.create({
    parentContainer: {
      width: '100%',
      position: 'absolute',
      backgroundColor: 'black',
    },
    videoBackground: {
      backgroundColor: 'black',
    },
    container: {
      flex: 1,
      alignSelf: 'stretch',
      justifyContent: 'space-between',
      height: screenHeight,
      overflow: 'visible',
    },
    fullScreenContainer: {
      flex: 1,
      alignSelf: 'stretch',
      justifyContent: 'space-between',
      overflow: 'visible',
      backgroundColor: 'black',
    },
    whiteContainer: {
      height: scaleModerate(18),
      backgroundColor: '#ffffff',
      alignSelf: 'stretch',
      width: '100%',
    },
    videoFS: {
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    video: {
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  }),
  error: StyleSheet.create({
    container: {
      backgroundColor: 'rgba( 0, 0, 0, 0.5 )',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      justifyContent: 'center',
      alignItems: 'center',
      height: null,
      width: null,
    },
    icon: {
      marginBottom: scaleModerate(16),
    },
    text: {
      backgroundColor: 'transparent',
      color: '#f27474',
    },
  }),
  loader: StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
  controls: StyleSheet.create({
    videoTaskBar: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    videoTaskBarFS: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      height: scaleModerate(30),
      marginBottom: scaleModerate(30),
    },
    subtitleBox: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: scaleModerate(10),
    },
    subtitleBoxPadding: {
      paddingBottom: scaleModerate(30),
    },
    subtitleText: {
      fontSize: scaleModerate(18),
      fontStyle: 'normal',
      lineHeight: scaleModerate(22),
      letterSpacing: 0,
      color: '#ffffff',
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: {width: -1, height: 1},
      textShadowRadius: 10,
    },
    videoTimeBar: {
      flex: 1,
      width: scaleModerate(256),
      height: scaleModerate(18),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    videoTimeBarFS: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: scaleModerate(-17),
    },
    videoSeekBarContainerFS: {
      flexDirection: 'column',
      justifyContent: 'flex-end',
      width: '80%',
      marginRight: scaleModerate(20),
    },
    ccText: {
      fontSize: scaleModerate(12),
      fontStyle: 'normal',
      lineHeight: scaleModerate(15),
      letterSpacing: 0,
      color: '#ffffff',
    },
    selectedCC: {
      backgroundColor: '#58e8ed',
    },
    unSelectedCC: {
      backgroundColor: '#707070',
    },
    square: {
      width: scaleModerate(18),
      height: scaleModerate(18),
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: scaleModerate(24.2),
    },
    videoExpandIcon: {
      width: scaleModerate(16),
      height: scaleModerate(16),
      marginRight: scaleModerate(17.2),
    },
    videoExpandIconFS: {
      width: scaleModerate(18),
      height: scaleModerate(18),
    },
    videoPlayIcon: {
      width: '40%',
      position: 'absolute',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    videoBackIcon: {
      width: scaleModerate(53),
      height: scaleModerate(25),
    },
    videoForwardIcon: {
      width: scaleModerate(40),
      height: scaleModerate(40),
    },
    playPausecontainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-end',
      height: '55%',
    },
    pauseButton: {
      width: scaleModerate(21),
      height: scaleModerate(30),
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 'auto',
      marginBottom: 'auto',
    },
    videoForwardButton: {
      width: scaleModerate(27),
      height: scaleModerate(27),
    },
    videoBackButton: {
      width: scaleModerate(27),
      height: scaleModerate(27),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: null,
      width: null,
    },
    column: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    vignette: {
      resizeMode: 'stretch',
    },
    control: {},
    text: {
      backgroundColor: 'transparent',
      color: '#FFF',
      fontSize: scaleModerate(14),
      textAlign: 'center',
    },
    pullRight: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    top: {
      flex: 1,
      alignItems: 'stretch',
      justifyContent: 'flex-start',
    },
    bottom: {
      alignItems: 'stretch',
      justifyContent: 'flex-end',
    },
    topControlGroup: {
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      width: null,
      margin: scaleModerate(12),
      marginBottom: scaleModerate(18),
    },
    bottomControlGroup: {
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginLeft: 12,
      marginRight: 12,
      marginBottom: 0,
    },
    volume: {
      flexDirection: 'row',
    },
    fullscreen: {
      flexDirection: 'row',
    },
    playPause: {
      position: 'relative',
      width: scaleModerate(40),
    },
    title: {
      alignItems: 'center',
      flex: 0.6,
      flexDirection: 'column',
      padding: 0,
    },
    titleText: {
      textAlign: 'center',
    },
    timer: {
      width: scaleModerate(80),
    },
    timerText: {
      fontSize: scaleModerate(12),
      fontStyle: 'normal',
      lineHeight: scaleModerate(15),
      letterSpacing: 0,
      color: '#58e8ed',
      textAlign: 'center',
    },
  }),
  volume: StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      height: 1,
      marginLeft: 20,
      marginRight: 20,
      width: 150,
    },
    track: {
      backgroundColor: '#333',
      height: 1,
      marginLeft: 7,
    },
    fill: {
      backgroundColor: '#FFF',
      height: 1,
    },
    handle: {
      position: 'absolute',
      marginTop: -24,
      marginLeft: -24,
      padding: 16,
    },
    icon: {
      marginLeft: 7,
    },
  }),
  seekbar: StyleSheet.create({
    containerFS: {
      alignSelf: 'stretch',
      height: scaleModerate(36),
      top: scaleModerate(18),
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
    container: {
      alignSelf: 'stretch',
      height: scaleModerate(36),
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      marginBottom: scaleModerate(-19),
    },
    track: {
      position: 'absolute',
      backgroundColor: '#FFF',
      height: scaleModerate(2),
      width: '100%',
      bottom: scaleModerate(18),
    },
    fill: {
      position: 'absolute',
      height: scaleModerate(2),
    },
    handle: {
      position: 'absolute',
      height: scaleModerate(34),
      width: scaleModerate(34),
    },
  }),
};
