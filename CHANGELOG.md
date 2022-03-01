# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
BUT this project does not adhere to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.0.5]
### Added
- rule syntax support for using different types of queries to locate html elements other than only by className.
- the default rules template is updated to use the latest query syntax
- added children (single level) support to identify children elements of a located html element

### Changed
- hide option now restores style properties of the hidden html element when toggled off
- users can now specify styles to use for hiding an element using `stylePropertiesOverrides`
- default behaviours are added for hiding an element if `stylePropertiesOverrides` is not provided for backwards compatibility
- old syntax for locating an element using class name (`className: 'myclassname'`) is deprecated. Move to use `queryType: 'className', queryText: 'myclassname'`) instead.