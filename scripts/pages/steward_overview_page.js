// Copyright 2015 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

"use strict";

var StewardOverviewPage = function(application, parameters) {
  SchedulePage.call(this, application);

  this.parameters_ = parameters;

  this.enableBackButton_ = parameters.length == 2;
  this.steward_ = null;
};

StewardOverviewPage.prototype = Object.create(SchedulePage.prototype);

// Called right before we start rendering the page. Determines the Steward that
// this overview page is about, making it available in |this.steward_|.
StewardOverviewPage.prototype.PrepareRender = function(currentPage) {
  var parentMethod = SchedulePage.prototype.PrepareRender.bind(this),
      self = this;

  return parentMethod().then(function(schedule) {
    var stewardSlug = self.parameters_[1];

    schedule.GetStewards().forEach(function(steward) {
      if (stewardSlug == steward.GetSlug())
        self.steward_ = steward;    
    });

    // If |self.steward_| could be set then we located the Steward for whom this
    // overview page is. If it's NULL then an error page will be shown instead.
  });
};

// Renders a telephone icon which, when clicked on, will open the device's dialer
// for the number associated with the current steward.
StewardOverviewPage.prototype.RenderTelephone = function(container) {
  var element = document.createElement('div'),
      link = document.createElement('a');

  link.textContent = '\ue6d5';
  link.setAttribute('href', 'tel:' + this.steward_.GetTelephone());

  element.className = 'steward-telephone';
  element.appendChild(link);

  container.insertBefore(element, container.firstChild);
};

// Called when the page is being rendered. We fill in information about the
// schedule of this steward here.
StewardOverviewPage.prototype.OnRender = function(application, container, content) {
  if (this.steward_ == null)
    return;  // we don't know who this is.

  if (this.enableBackButton_)
    content.insertBefore(this.RenderBackButton(), content.firstChild);

  var listContainer = content.querySelector('#schedule-contents');
  if (!listContainer)
    return;

  var infoBox = content.querySelector('#info-box');
  if (infoBox && this.steward_.GetTelephone())
    this.RenderTelephone(infoBox);

  var entries = [];

  // A steward's schedule doesn't care about the timings of the event itself, but
  // rather cares about their shift and then the event's information.
  this.steward_.GetShifts().forEach(function(shift) {
    entries.push(new ScheduleEntry(shift.begin, shift.end, shift.event.GetName(),
                                   shift.event.GetLocation().GetName(),
                                   shift.event.GetNavigateLocation(),
                                   shift.event.IsHidden() ? 'hidden' : ''));
  });

  listContainer.appendChild(
      this.RenderEntries(entries,
                         'No shifts have been scheduled for this steward.'));
};

//
StewardOverviewPage.prototype.GetImage = function() {
  return this.steward_ ? this.steward_.GetImage() : null;
};

StewardOverviewPage.prototype.GetName = function() {
  return this.steward_ ? this.steward_.GetName() : null;
};

StewardOverviewPage.prototype.GetDescription = function() {
  if (!this.steward_)
    return null;

  if (this.steward_.IsHidden())
    return 'Steward Henchman';

  var senior = this.steward_.GetSenior(),
      title = this.steward_.GetTitle();

  if (!senior)
    return title;

  return title + ' in ' + (senior.GetName().split(' ')[0]) + '\'s team';
};