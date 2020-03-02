# Install Enhanced Emotion

```
npm i hbs-classes
```

# APIs
- [css](#css)
- [useStyles](#usestyles)
- [ThemeProvider](#themeprovider)

## css
Define styles

```
import {css} from 'hbs-classes'

const styles = {}

styles.root = css`
  background: rgba(0, 0, 0, 0.15);
`

export default styles
```

Styles based on props
```
styles.name = css`
  color: green;

  ${(props) => props.active && `
    color: red;
  `}
`

styles.phone = css`
  color: ${(props) => props.color};
`
```

Shorthand
```
import {is, by} from 'hbs-classes/utils'

styles.name = css`
  color: green;

  ${is('active')`
    color: red;
  `}
`

styles.phone = css`
  color: ${by('color')};
`
```

Support nested syntax
```
styles.phone = css`
  &::before {
    content: '+84 ';
  }
`

styles.firstName = css``

styles.lastName = css``

styles.name = css`
  &:hover {
    ${styles.lastName}, ${styles.firstName} {
      font-weight: bold;
    }
  }
`
```

## useStyles
A custom hook to get classNames from style file

```
import {useStyles} from 'hbs-classes'
import styles from './styles'

const App = () => {
  const classes = useStyles(styles)
  
  return (
    <div className={classes('root')}>
      <div className={classes('name')}>Khanh Pham</div>

      <div className={classes('address')}>593 Xo Viet Nghe Tinh</div>

      <div className={classes('phone', {color: 'red'})}>0347719454</div>
    </div>
  )
}
```

## ThemeProvider
Global theme

```
import {ThemProvider} from 'hbs-classes'

const App = () => {
  return (
    <ThemeProvider theme={{
      colors: {
        green: 'green',
        yellow: 'yellow',
      },
    }}>
      /* content */
    </ThemeProvider>
  )
}

export default App
```

styles file
```
import {css} from 'hbs-classes'
import {by} from 'hbs-classes/utils

const styles = {}

styles.root = css`
  background: ${by('bgColor')};
`

styles.name = css`
  color: red;
  font-size: 3rem;
`

styles.address = css`
  color: ${by('theme.colors.yellow')};
`

export default styles
```