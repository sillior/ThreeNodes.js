var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['jQuery', 'Underscore', 'Backbone'], function($, _, Backbone) {
  "use strict";  return ThreeNodes.Sidebar = (function(_super) {

    __extends(Sidebar, _super);

    function Sidebar() {
      this.init_sidebar_tab_new_node = __bind(this.init_sidebar_tab_new_node, this);
      this.init_sidebar_search = __bind(this.init_sidebar_search, this);
      this.filter_list = __bind(this.filter_list, this);
      this.filter_list_item = __bind(this.filter_list_item, this);
      this.init_sidebar_tabs = __bind(this.init_sidebar_tabs, this);
      Sidebar.__super__.constructor.apply(this, arguments);
    }

    Sidebar.prototype.initialize = function() {
      Sidebar.__super__.initialize.apply(this, arguments);
      this.init_sidebar_tab_new_node();
      this.init_sidebar_search();
      return this.init_sidebar_tabs();
    };

    Sidebar.prototype.init_sidebar_tabs = function() {
      return this.$el.tabs({
        fx: {
          opacity: 'toggle',
          duration: 100
        }
      });
    };

    Sidebar.prototype.filter_list_item = function($item, value) {
      var s;
      s = $.trim($("a", $item).html()).toLowerCase();
      if (s.indexOf(value) === -1) {
        return $item.hide();
      } else {
        return $item.show();
      }
    };

    Sidebar.prototype.filter_list = function(ul, value) {
      var has_visible_items, self, ul_title;
      self = this;
      ul_title = ul.prev();
      has_visible_items = false;
      $("li", ul).each(function() {
        return self.filter_list_item($(this), value);
      });
      if ($("li:visible", ul).length === 0) {
        return ul_title.hide();
      } else {
        return ul_title.show();
      }
    };

    Sidebar.prototype.init_sidebar_search = function() {
      var self;
      self = this;
      return $("#node_filter").keyup(function(e) {
        var v;
        v = $.trim($("#node_filter").val()).toLowerCase();
        if (v === "") {
          return $("#tab-new li, #tab-new h3").show();
        } else {
          return $("#tab-new ul").each(function() {
            return self.filter_list($(this), v);
          });
        }
      });
    };

    Sidebar.prototype.init_sidebar_tab_new_node = function() {
      var $container, group, group_name, node, nodes_by_group, result, self, _i, _len, _ref;
      self = this;
      $container = $("#tab-new");
      result = [];
      nodes_by_group = {};
      for (node in ThreeNodes.nodes) {
        group_name = ThreeNodes.nodes[node].group_name.replace(/\./g, "-");
        if (!nodes_by_group[group_name]) nodes_by_group[group_name] = [];
        nodes_by_group[group_name].push(node);
      }
      for (group in nodes_by_group) {
        $container.append("<h3>" + group + "</h3><ul id='nodetype-" + group + "'></ul>");
        _ref = nodes_by_group[group];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          node = _ref[_i];
          $("#nodetype-" + group, $container).append("<li><a class='button' rel='" + node + "' href='#'>" + ThreeNodes.nodes[node].node_name + "</a></li>");
        }
      }
      $("a.button", $container).draggable({
        revert: "valid",
        opacity: 0.7,
        helper: "clone",
        revertDuration: 0,
        scroll: false,
        containment: "document"
      });
      return $("#container").droppable({
        accept: "#tab-new a.button",
        activeClass: "ui-state-active",
        hoverClass: "ui-state-hover",
        drop: function(event, ui) {
          var dx, dy, nodename, offset;
          nodename = ui.draggable.attr("rel");
          offset = $("#container-wrapper").offset();
          dx = ui.position.left + $("#container-wrapper").scrollLeft() - offset.left - 10;
          dy = ui.position.top + $("#container-wrapper").scrollTop() - $("#sidebar").scrollTop() - offset.top;
          ThreeNodes.events.trigger("CreateNode", nodename, dx, dy);
          return $("#sidebar").show();
        }
      });
    };

    return Sidebar;

  })(Backbone.View);
});