import {get} from 'lodash-es'

export default (path) => (props) => get(props, path)
