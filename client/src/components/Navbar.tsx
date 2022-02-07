import AlbumIcon                                                from '@mui/icons-material/Album'
import AudiotrackIcon                                           from '@mui/icons-material/Audiotrack'
import HomeIcon                                                 from '@mui/icons-material/Home'
import MenuIcon                                                 from '@mui/icons-material/Menu'
import { AppBar, CssBaseline, IconButton, Toolbar, Typography } from '@mui/material'
import Box                                                      from '@mui/material/Box'
import Drawer                                                   from '@mui/material/Drawer'
import List                                                     from '@mui/material/List'
import ListItem                                                 from '@mui/material/ListItem'
import ListItemIcon                                             from '@mui/material/ListItemIcon'
import ListItemText                                             from '@mui/material/ListItemText'
import { useRouter }                                            from 'next/router'
import * as React                                               from 'react'

const menuItems = [
  { text: 'Главная', href: '/', icon: <HomeIcon /> },
  { text: 'Список треков', href: '/tracks', icon: <AudiotrackIcon /> },
  { text: 'Список альбомов', href: '/albums', icon: <AlbumIcon /> }
]

export default function TemporaryDrawer(){
  const [state, setState] = React.useState(false)

  const router = useRouter()

  const toggleDrawer =
    (open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return
        }

        setState(open)
      }

  return (
    <div>
      <CssBaseline />
      <AppBar
        position='fixed'
      >
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={toggleDrawer(true)}
            edge='start'
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant='h6'
            noWrap
            component='div'
          >
            Сборник треков
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor='left'
        open={state}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role='presentation'
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {menuItems.map(({ text, href, icon }) => (
              <ListItem
                button
                key={href}
                onClick={() => router.push(href)}
              >
                <ListItemIcon>
                  {icon}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </div>
  )
}
