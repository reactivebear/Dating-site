export default {
    'public': [
        {
            'path': '/',
            'component': 'Home'
        }, {
            'path': '/girls',
            'component': 'Home'
        }, {
            'path': '/success-stories',
            'component': 'SuccessStories'
        }, {
            'path': '/success-stories/:id',
            'component': 'SuccessStories'
        }, {
            'path': '*',
            'component': 'NotFound'
        }
    ],
    'client': [
        {
            'path': '/',
            'component': 'Home'
        }, {
            'path': '/profile/*',
            'component': 'Home'
        }, {
            'path': '/mail/*',
            'component': 'Home'
        }, {
            'path': '/girls',
            'component': 'Home'
        }, {
            'path': '/contacts/*',
            'component': 'Home'
        }, {
            'path': '/member/:id',
            'component': 'Member'
        }, {
            'path': '/shop',
            'component': 'Shop'
        }, {
            'path': '/shop/:prodId',
            'component': 'Shop'
        }, {
            'path': '*',
            'component': 'NotFound'
        }
    ],
    'girl': [
        {
            'path': '/',
            'component': 'Home'
        }, {
            'path': '/profile/*',
            'component': 'Home'
        }, {
            'path': '/men',
            'component': 'Home'
        }, {
            'path': '/mail/*',
            'component': 'Home'
        }, {
            'path': '/contacts/*',
            'component': 'Home'
        }, {
            'path': '/member/:id',
            'component': 'Member'
        }, {
            'path': '*',
            'component': 'NotFound'
        }
    ]
}