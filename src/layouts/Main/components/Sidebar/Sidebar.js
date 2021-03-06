import React, { useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { connect } from 'react-redux';
import withCookies from '../../../../HOC/withCookies';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import { changeLanguage } from '../../../../actions';
import { Profile, SidebarNav } from './components';
import { routes } from '../../../../config/constants';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;
  const classes = useStyles();
  const { t, i18n, changeL } = props;
  useEffect(() => {
    changeL(props.language.language);
    i18n.changeLanguage(props.c_language);
  }, [props.c_language]);

  const pages = [
    {
      title: t('sidebar.dashboard'),
      href: routes.DASHBOARD,
      icon: <DashboardIcon />
    },

    {
      title: t('sidebar.groups'),
      href: routes.GROUPS,
      icon: <ShoppingBasketIcon />
    },
    {
      title: t('sidebar.participants'),
      href: routes.PARTICIPANTS,
      icon: <PeopleIcon />
    },
    {
      title: t('sidebar.moderators'),
      href: routes.MODERATORS,
      icon: <AccountBoxIcon />
    }
  ];

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}>
      <div {...rest} className={clsx(classes.root, className)}>
        <Profile />
        <Divider className={classes.divider} />
        <SidebarNav className={classes.nav} pages={pages} />
      </div>
    </Drawer>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    changeL: lang => dispatch(changeLanguage(lang))
  };
}

const mapStateToProps = state => ({
  language: state.language
});

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withCookies,
  withTranslation('common')
)(Sidebar);
